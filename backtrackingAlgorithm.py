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
    isLab: bool
    capacity: int


class Professor(NamedTuple):
    """
    Represents a professor, and their level of class they can teach.
    """
    name: str


class Course(NamedTuple):
    """
    Represents a course, whether it is a double block, its name, and what
    minimum level is required to teach it.
    """
    name: str
    identifier: str
    needsLab: bool
    courseSize: int
    level: int
    needsDouble: bool


class TimeBlock(NamedTuple):
    """
    Represents a time block, which day it is on, which timeslot it is in, and
    whether it is a double block.
    """
    identifier: str
    isDouble: bool
    day: int  # x (0-4, M-F)
    timeslot: int  # y (0-7, ???)


class Section(NamedTuple):
    """
    Represents a section of a course, which classroom it is in, and which
    professor is teaching it.
    """
    course: Course
    # sectionNum: int  # circle back to this?
    professor: Professor
    timeBlock: TimeBlock
    classroom: Classroom


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
            section = Section(classroom=classroom, course=course,
                              professor=professor, timeBlock=placeHolder)
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


placeHolder: TimeBlock = TimeBlock(identifier="placeHolder", isDouble=False,
                                   day=-1, timeslot=-1)


timeBlockMatrix: List[List[TimeBlock]] = [
    # Monday
    [
        TimeBlock(identifier="Monday 1", isDouble=False, day=0, timeslot=0),
        TimeBlock(identifier="Monday 2", isDouble=False, day=0, timeslot=1),
        TimeBlock(identifier="Monday 3", isDouble=False, day=0, timeslot=2),
        TimeBlock(identifier="Monday 4", isDouble=False, day=0, timeslot=3),
        TimeBlock(identifier="Monday 5", isDouble=False, day=0, timeslot=4),
        TimeBlock(identifier="Monday 6", isDouble=False, day=0, timeslot=5),
        TimeBlock(identifier="Monday 7", isDouble=False, day=0, timeslot=6),
        TimeBlock(identifier="Monday 8", isDouble=False, day=0, timeslot=7),
    ],
    # Tuesday
    [
        TimeBlock(identifier="Tuesday 1", isDouble=False, day=1, timeslot=0),
        TimeBlock(identifier="Tuesday 2", isDouble=False, day=1, timeslot=1),
        TimeBlock(identifier="Tuesday 3", isDouble=False, day=1, timeslot=2),
        TimeBlock(identifier="Tuesday 4", isDouble=False, day=1, timeslot=3),
        TimeBlock(identifier="Tuesday 5", isDouble=False, day=1, timeslot=4),
        TimeBlock(identifier="Tuesday 6", isDouble=False, day=1, timeslot=5),
        TimeBlock(identifier="Tuesday 7", isDouble=False, day=1, timeslot=6),
        TimeBlock(identifier="Tuesday 8", isDouble=False, day=1, timeslot=7),
    ],
    # Wednesday (double blocks early, 5th and 6th blocks off)
    [
        TimeBlock(identifier="Wednesday A", isDouble=True, day=2, timeslot=0),
        TimeBlock(identifier="Wednesday B", isDouble=True, day=2, timeslot=2),
        TimeBlock(identifier="Wednesday 7", isDouble=False, day=2, timeslot=6),
        TimeBlock(identifier="Wednesday 8", isDouble=False, day=2, timeslot=7),
    ],
    # Thursday
    [
        TimeBlock(identifier="Thursday 1", isDouble=False, day=3, timeslot=0),
        TimeBlock(identifier="Thursday 2", isDouble=False, day=3, timeslot=1),
        TimeBlock(identifier="Thursday 3", isDouble=False, day=3, timeslot=2),
        TimeBlock(identifier="Thursday 4", isDouble=False, day=3, timeslot=3),
        TimeBlock(identifier="Thursday 5", isDouble=False, day=3, timeslot=4),
        TimeBlock(identifier="Thursday 6", isDouble=False, day=3, timeslot=5),
        TimeBlock(identifier="Thursday 7", isDouble=False, day=3, timeslot=6),
        TimeBlock(identifier="Thursday 8", isDouble=False, day=3, timeslot=7),
    ],
    # Friday (no double blocks, 7th and 8th blocks off)
    [
        TimeBlock(identifier="Friday 1", isDouble=False, day=4, timeslot=0),
        TimeBlock(identifier="Friday 2", isDouble=False, day=4, timeslot=1),
        TimeBlock(identifier="Friday 3", isDouble=False, day=4, timeslot=2),
        TimeBlock(identifier="Friday 4", isDouble=False, day=4, timeslot=3),
        TimeBlock(identifier="Friday 5", isDouble=False, day=4, timeslot=4),
        TimeBlock(identifier="Friday 6", isDouble=False, day=4, timeslot=5),
    ],
]


def assign_timeblocks(
    schedule: Schedule,
    timeBlocks: List[List[TimeBlock]]
) -> Schedule:
    """
    Assigns timeblocks to sections based on the schedule.
    """
    for day in timeBlocks:
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
    professors: List[Professor] = [Professor(name="Murat"),
                                   Professor(name="David"),
                                   Professor(name="Brian"),
                                   Professor(name="Wei"),
                                   Professor(name="Sarah"),
                                   Professor(name="Frank"),
                                   Professor(name="Brent"),
                                   Professor(name="Scott"),
                                   Professor(name="Alex"),
                                   Professor(name="Eric"),
                                   Professor(name="Josh")]
    classrooms = [Classroom(room="JOYC 201", isLab=True, capacity=30),
                  Classroom(room="JOYC 210", isLab=False, capacity=30),
                  Classroom(room="JOYC 211", isLab=False, capacity=30),
                  Classroom(room="MIC 308", isLab=True, capacity=45),]
    courses = [Course(identifier="CSI-120", needsDouble=False, level=1,
               needsLab=False, courseSize=30,
               name="Intro to Mobile & Web Development"),
               Course(identifier="CSI-140", needsDouble=False, level=1,
               needsLab=False, courseSize=30,
               name="Introduction to Programming"),
               Course(identifier="CSI-180", needsDouble=True, level=1,
               needsLab=False, courseSize=30,
               name="Innovation 1: Technology Sandbox"),
               Course(identifier="CSI-240", needsDouble=False, level=2,
               needsLab=True, courseSize=15, name="Advanced Programming"),
               Course(identifier="CSI-230", needsDouble=False, level=2,
               needsLab=True, courseSize=15, name="Linux/Unix Programming"),
               Course(identifier="CSI-281", needsDouble=False, level=2,
               needsLab=False, courseSize=30,
               name="Data Structures and Algorithms"),
               Course(identifier="CSI-280", needsDouble=True, level=2,
               needsLab=False, courseSize=30,
               name="Innovation 2: Open Source Software Development"),
               Course(identifier="CSI-300", needsDouble=True, level=3,
               needsLab=False, courseSize=30,
               name="Database Management Systems"),
               Course(identifier="CSI-320", needsDouble=False, level=3,
               needsLab=True, courseSize=20, name="Global IT and Ethics"),
               Course(identifier="CSI-351", needsDouble=False, level=3,
               needsLab=False, courseSize=35, name="Software Testing"),
               Course(identifier="CSI-352", needsDouble=False, level=3,
               needsLab=False, courseSize=35, name="Advanced Algorithms"),
               Course(identifier="CSI-355", needsDouble=False, level=3,
               needsLab=False, courseSize=35,
               name="Operating Systems Architecture"),
               Course(identifier="CSI-357", needsDouble=True, level=3,
               needsLab=False, courseSize=25,
               name="Server-side Web Development"),
               Course(identifier="CSI-370", needsDouble=False, level=3,
               needsLab=False, courseSize=30, name="Computer Architecture"),
               Course(identifier="CSI-380", needsDouble=False, level=3,
               needsLab=False, courseSize=30,
               name="Innovation 3: Emerging Languages"),
               Course(identifier="CSI-480", needsDouble=False, level=4,
               needsLab=False, courseSize=30,
               name="Innovation 4: Topics in AI"),
               Course(identifier="CSI-330", needsDouble=True, level=3,
               needsLab=False, courseSize=15,
               name="Software Development Methodologies"),
               Course(identifier="CSI-340", needsDouble=False, level=3,
               needsLab=False, courseSize=30, name="Software Design Patterns"),
               Course(identifier="CSI-420", needsDouble=True, level=4,
               needsLab=False, courseSize=30, name="Software Refactoring"),
               Course(identifier="CSI-440", needsDouble=False, level=4,
               needsLab=False, courseSize=20,
               name="Software Requirements Engineering"),]

    # find and print answer
    solution(courses, classrooms, professors)
