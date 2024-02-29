#!/usr/bin/env python3
# calendar.py
# Solve the scheduling problem using the backtracking search algorithm
# Project done for CSI-480 Artificial Intelligence at Champlain College
# Completed by: Alec Ross, Joe Marchesini, Raymond Zheng,
# Graham Finlayson-Fife, and Liam Cannon
# Date: 10/11/2022

# from xml import dom
from typing import Dict, List, NamedTuple  # , Optional
from csp import CSP, Constraint
from copy import deepcopy
from random import shuffle

# set constants
WEDNESDAY = 2
FRIDAY = 4

BLOCK_FIVE = 4
BLOCK_SIX = 5
BLOCK_SEVEN = 6
BLOCK_EIGHT = 7


class Classroom(NamedTuple):
    """
    Represents a classroom, whether it is a lab or not, and its capacity.
    """
    room: str
    # isLab: bool
    # capacity: int


class Professor(NamedTuple):
    """
    Represents a professor, and their level of class they can teach.
    """
    name: str
    level: int  # remove?


class Course(NamedTuple):
    """
    Represents a course, whether it is a double block, its name, and what
    minimum level is required to teach it.
    """
    # name: str
    identifier: str
    # needsLab: bool
    # courseSize: int
    needsDouble: bool
    level: int


class TimeBlock(NamedTuple):
    """
    Represents a time block, which day it is on, which timeslot it is in, and
    whether it is a double block.
    """
    identifier: str
    isDouble: bool
    # TODO: update schema to match
    day: int  # x (0-4, M-F)
    timeslot: int  # y (0-7, ???)


class Section(NamedTuple):
    """
    Represents a section of a course, which classroom it is in, and which
    professor is teaching it.
    """
    classroom: Classroom
    # sectionNum: int
    course: Course
    professor: Professor
    timeBlock: TimeBlock


class CoursePreference(NamedTuple):
    """
    Represents a course preference, which professor is teaching it, which
    course it is, and what priority it is.
    """
    professor: Professor
    course: Course
    priority: int


class TimePreference(NamedTuple):
    """
    Represents a time preference, which professor is teaching it, which
    timeblock it is, and what priority it is.
    """
    professor: Professor
    timeBlock: TimeBlock
    priority: int


class Schedule(NamedTuple):
    """
    Represents a schedule, which is a grid of sections.
    TODO: Use TimeBlock class to represent a time block instead of a grid of
    Sections. This actually doesn't even need to be a class, it could just
    be a list of lists of Sections.
    """
    schedule: List[List[Section]]


def dict_to_schedule(variables, dict, schedule):
    """
    Converts a dictionary to a schedule, with making lists of sections in
    positions that allow for multiple classes in the same timeslot.
    """
    newSched = deepcopy(schedule.schedule)
    list_of_domains = [dict[i].schedule for i in variables]
    for i in list_of_domains:
        for x in range(len(i)):
            for y in range(len(i[0])):
                if i[x][y] != "-":
                    if newSched[x][y] == "-":
                        newSched[x][y] = [i[x][y]]
                    else:
                        newSched[x][y].append(i[x][y])
    return newSched


def generate_grid(rows: int, columns: int) -> Schedule:
    # initialize grid with random letters
    return Schedule([["-" for c in range(columns)] for r in range(rows)])


def display_grid(grid: Schedule) -> None:
    """Displays the schedule in a human-readable format."""
    # rotate the grid so that it displays correctly
    for i in range(len(grid[0])):
        for y in range(len(grid)):
            if grid[y][i] == "-":
                print("no class", end=" | ")
            else:
                for x in range(len(grid[y][i])):
                    print(grid[y][i][x].course.identifier + " " + grid[y][i]
                          [x].professor.name + " " +
                          grid[y][i][x].classroom.room, end="")
                    if not (x + 1 >= len(grid[y][i])):
                        print(", ", end="")
                    if x + 1 >= len(grid[y][i]):
                        print(" | ", end="")
        print("\n")


def generate_domain(course: Course, schedule: Schedule, prof: List[Professor],
                    classrooms: List[Classroom]) -> List[Schedule]:
    """
    Generates a domain consisting of all possible combinations of sections.
    """
    SCHEDULE_WIDTH = len(schedule.schedule)
    SCHEDULE_LENGTH = len(schedule.schedule[0])
    professors = deepcopy(prof)

    domain: List[Schedule] = []

    for classroom in classrooms:
        shuffle(professors)
        for professor in professors:
            section = Section(classroom, course, professor, placeHolder)
            if section.professor.level >= section.course.level:
                # generate domain for double block course (1x2)
                if course.needsDouble:
                    for row in range(SCHEDULE_WIDTH):
                        for column in range(SCHEDULE_LENGTH):
                            if (column + 1 <= SCHEDULE_LENGTH - 1) and \
                                    (schedule.schedule[row][column] == "-" and
                                     schedule.schedule[row][column + 1] == "-"
                                     ):
                                tempCopy = deepcopy(schedule)
                                tempCopy.schedule[row][column] = section
                                tempCopy.schedule[row][column + 1] = section
                                domain.append(tempCopy)
                else:
                    # generate domain for single block courses (1x1)
                    for row in range(2):
                        for column in range(len(schedule.schedule[0])):
                            if (schedule.schedule[row][column] == "-"):
                                tempCopy = deepcopy(schedule)
                                tempCopy.schedule[row][column] = section
                                tempCopy.schedule[row + 3][column] = section
                                domain.append(tempCopy)
    return domain


class ScheduleConstraint(Constraint[Course, List[Schedule]]):
    # can't have same class twice on same day
    # can't have same class twice on same time slot
    # can't have overlapping classes in the same classroom
    def __init__(self, variables: List[Course]) -> None:
        self.variables: List[Course] = variables

    def satisfied(self, assignment: Dict) -> bool:
        # check if any courses overlap
        values = [locs for values in assignment.values() for locs in values]
        for i in values:  # for each course
            for j in values:  # for each other course
                if i != j:  # if they are not the same course
                    for x in range(len(i)):  # for each row in the schedule
                        # for each column in the schedule
                        for y in range(len(i[0])):
                            # if there is a class in both schedules
                            if i[x][y] != "-" and j[x][y] != "-":
                                # check if classroom or professor overlaps
                                if i[x][y].classroom == j[x][y].classroom or \
                                        i[x][y].professor == j[x][y].professor:
                                    return False
                            # TODO: Stop hardcoding this!
                            # check if courses are on no classes allowed days
                            if i[x][y] != "-" or j[x][y] != "-":
                                # time slots where classes are not allowed
                                if (x == WEDNESDAY and (y == BLOCK_FIVE or
                                                        y == BLOCK_SIX)) or \
                                    (x == FRIDAY and (y == BLOCK_SEVEN or
                                                      y == BLOCK_EIGHT)):
                                    return False
                            # make sure non double block classes are only
                            # on evening time slots on wednesday
                            if i[x][y] != "-" and \
                                    not i[x][y].course.needsDouble:
                                if x == WEDNESDAY and y < BLOCK_SEVEN:
                                    return False
        return True


placeHolder: TimeBlock = TimeBlock("placeHolder", False, -1, -1)


timeBlockMatrix: List[List[TimeBlock]] = [
    # Monday
    [
        TimeBlock("Monday 1", False, 0, 0),
        TimeBlock("Monday 2", False, 0, 1),
        TimeBlock("Monday 3", False, 0, 2),
        TimeBlock("Monday 4", False, 0, 3),
        TimeBlock("Monday 5", False, 0, 4),
        TimeBlock("Monday 6", False, 0, 5),
        TimeBlock("Monday 7", False, 0, 6),
        TimeBlock("Monday 8", False, 0, 7),
    ],
    # Tuesday
    [
        TimeBlock("Tuesday 1", False, 1, 0),
        TimeBlock("Tuesday 2", False, 1, 1),
        TimeBlock("Tuesday 3", False, 1, 2),
        TimeBlock("Tuesday 4", False, 1, 3),
        TimeBlock("Tuesday 5", False, 1, 4),
        TimeBlock("Tuesday 6", False, 1, 5),
        TimeBlock("Tuesday 7", False, 1, 6),
        TimeBlock("Tuesday 8", False, 1, 7),
    ],
    # Wednesday (double blocks early, 5th and 6th blocks off)
    [
        TimeBlock("Wednesday A", True, 2, 0),
        TimeBlock("Wednesday B", True, 2, 2),
        TimeBlock("Wednesday 7", False, 2, 6),
        TimeBlock("Wednesday 8", False, 2, 7),
    ],
    # Thursday
    [
        TimeBlock("Thursday 1", False, 3, 0),
        TimeBlock("Thursday 2", False, 3, 1),
        TimeBlock("Thursday 3", False, 3, 2),
        TimeBlock("Thursday 4", False, 3, 3),
        TimeBlock("Thursday 5", False, 3, 4),
        TimeBlock("Thursday 6", False, 3, 5),
        TimeBlock("Thursday 7", False, 3, 6),
        TimeBlock("Thursday 8", False, 3, 7),
    ],
    # Friday (no double blocks, 7th and 8th blocks off)
    [
        TimeBlock("Friday 1", False, 4, 0),
        TimeBlock("Friday 2", False, 4, 1),
        TimeBlock("Friday 3", False, 4, 2),
        TimeBlock("Friday 4", False, 4, 3),
        TimeBlock("Friday 5", False, 4, 4),
        TimeBlock("Friday 6", False, 4, 5),
    ],
]


def assign_timeblocks(schedule: Schedule) -> Schedule:
    """
    Assigns timeblocks to sections based on the schedule.
    """
    for day in timeBlockMatrix:
        for timeBlock in day:
            row = timeBlock.day
            column = timeBlock.timeslot
            schedule.schedule[row][column].timeBlock = timeBlock
            if timeBlock.isDouble:
                schedule.schedule[row][column + 1].timeBlock = timeBlock
    return schedule


def solution(courses: List[Course], classrooms: List[Classroom],
             professors: List[Professor]) -> None:
    """
    Generates a schedule for the given courses, classrooms, and professors.
    """
    variableDict = {}
    # generate empty grid
    newSched = generate_grid(5, 8)
    # shuffle courses to add some randomness into generation
    shuffle(courses)
    # generate domains for all courses
    for x in courses:
        variableDict[x] = generate_domain(
            x, deepcopy(newSched), professors, classrooms)

    # run csp on generated domains
    csp = CSP(courses, variableDict)
    csp.add_constraint(ScheduleConstraint(courses))
    genOutcome = csp.backtracking_search()

    # print csp's answer
    if isinstance(genOutcome, type(None)):
        print("returned none")
    else:
        # displays solution neatly
        display_grid(dict_to_schedule(courses, genOutcome, newSched))


if __name__ == "__main__":
    # set parameters
    professors: List[Professor] = [Professor("Murat", 4),
                                   Professor("David", 4),
                                   Professor("Brian", 4),
                                   Professor("Wei", 4),
                                   Professor("Sarah", 4),
                                   Professor("Frank", 4),
                                   Professor("Brent", 4),
                                   Professor("Scott", 4),
                                   Professor("Alex", 4),
                                   Professor("Eric", 4),
                                   Professor("Josh", 4)]
    classrooms: List[Classroom] = [Classroom("JOYC 201"), Classroom(
        "JOYC 210"), Classroom("JOYC 211"), Classroom("MIC 308")]
    courses = [Course("CSI-120", False, 1), Course("CSI-140", False, 1),
               Course("CSI-180", True, 1), Course("CSI-240", False, 2),
               Course("CSI-230", False, 2), Course("CSI-281", False, 2),
               Course("CSI-280", True, 2), Course("CSI-300", True, 3),
               Course("CSI-320", False, 3), Course("CSI-351", False, 3),
               Course("CSI-352", False, 3), Course("CSI-355", False, 3),
               Course("CSI-357", True, 3), Course("CSI-370", False, 3),
               Course("CSI-380", False, 3), Course("CSI-480", False, 4),
               Course("CSI-330", True, 3), Course("CSI-340", False, 3),
               Course("CSI-420", True, 4), Course("CSI-440", False, 4)]

    # find and print answer
    solution(courses, classrooms, professors)
