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
    name: str
    # identifier: str
    # needsLab: bool
    # courseSize: int
    needsDouble: bool
    level: int


class Section(NamedTuple):
    """
    Represents a section of a course, which classroom it is in, and which
    professor is teaching it.
    """
    classroom: Classroom
    # sectionNum: int
    course: Course
    professor: Professor
    # timeBlock: TimeBlock


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
    TODO: use TimeBlock class to represent a time block instead of a grid of
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
                    print(grid[y][i][x].course.name + " " + grid[y][i]
                          [x].professor.name + " " +
                          grid[y][i][x].classroom.room, end="")
                    if not (x+1 >= len(grid[y][i])):
                        print(", ", end="")
                    if x+1 >= len(grid[y][i]):
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
            section = Section(classroom, course, professor)
            if section.professor.level >= section.course.level:
                # generate domain for double block course (1x2)
                if course.needsDouble:
                    for row in range(SCHEDULE_WIDTH):
                        for column in range(SCHEDULE_LENGTH):
                            if (column + 1 <= SCHEDULE_LENGTH-1) and \
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
                                tempCopy.schedule[row+3][column] = section
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
                            # check if courses are no no classes allowed days
                            if i[x][y] != "-" or j[x][y] != "-":
                                # time slots where classes are not allowed
                                if (x == WEDNESDAY and (y == BLOCK_FIVE or
                                                        y == BLOCK_SIX)):
                                    return False
                                # time slots where classes are not allowed
                                elif x == FRIDAY and (y == BLOCK_SEVEN or
                                                      y == BLOCK_EIGHT):
                                    return False
        return True


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
    courses = [Course("120", False, 1), Course("140", False, 1),
               Course("180", True, 1), Course("240", False, 2),
               Course("230", False, 2), Course("281", False, 2),
               Course("280", True, 2), Course("300", True, 3),
               Course("320", False, 3), Course("351", False, 3),
               Course("352", False, 3), Course("355", False, 3),
               Course("357", True, 3), Course("370", False, 3),
               Course("380", False, 3), Course("480", False, 4),
               Course("330", True, 3), Course("340", False, 3),
               Course("420", True, 4), Course("440", False, 4)]

    # find and print answer
    solution(courses, classrooms, professors)
