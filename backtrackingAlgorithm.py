#!/usr/bin/env python3
# calendar.py
# Solve the scheduling problem using the backtracking search algorithm
# Project done for CSI-480 Artificial Intelligence at Champlain College
# Completed by: Alec Ross, Joe Marchesini, Raymond Zheng,
# Graham Finlayson-Fife, and Liam Cannon
# Date: 10/11/2022

# Considering change to CSP:
# Variables: List[Section]
# Domains: Dict[Section, List[Schedule]]

# from xml import dom
from typing import Dict, List, NamedTuple  # , Optional
from csp import CSP, Constraint
from copy import deepcopy
from random import shuffle
import yaml
import json
import sys
from itertools import chain

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
    id: int
    room: str
    is_lab: bool
    room_capacity: int


class Professor(NamedTuple):
    """
    Represents a professor, and their level of class they can teach.
    """
    id: int
    name: str


class Course(NamedTuple):
    """
    Represents a course, whether it is a double block, its name, and what
    minimum level is required to teach it.
    """
    id: int
    name: str
    identifier: str
    needs_lab: bool
    course_size: int
    level: int
    double_block: bool


class TimeBlock(NamedTuple):
    """
    Represents a time block, which day it is on, which timeslot it is in, and
    whether it is a double block.
    """
    id: int
    identifier: str
    block_type: int  # 0 = single, 1 = double_start, 2 = double_end
    day: int  # x (0-4, M-F)
    timeslot: int  # y (0-7, ???)
    corresponding_block: int  # id of corresponding block (can be null)


class Section(NamedTuple):
    """
    Represents a section of a course, which classroom it is in, and which
    professor is teaching it.
    """
    course: Course
    section_num: int
    professor: Professor
    start: TimeBlock
    end: TimeBlock
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
    time_block: TimeBlock
    priority: int


class Schedule(NamedTuple):
    """
    Represents a schedule, which is a grid of sections.
    TODO: Use TimeBlock class to represent a time block instead of a grid of
    Sections. This actually doesn't even need to be a class, it could just
    be a list of lists of Sections.
    """
    schedule: List[List[Section]]


def dict_to_schedule(variables, dict, schedule: Schedule
                     ) -> List[List[Section]]:
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
                              professor=professor, start=placeHolder,
                              end=placeHolder, section_num=-1)
            # generate domain for double block course (1x2)
            if course.double_block:
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
                            classA = i[x][y]
                            classB = j[x][y]
                            if classA != "-" and classB != "-":
                                # Constraints 1 & 2:
                                # check if classroom or professor overlaps
                                if classA.classroom == classB.classroom or \
                                        classA.professor == classB.professor:
                                    return False
                            # TODO: Stop hardcoding this!
                            # check if courses are on no classes allowed days
                            if classA != "-" or classB != "-":
                                # time slots where classes are not allowed
                                if (x == WEDNESDAY and (y == BLOCK_FIVE or
                                                        y == BLOCK_SIX)) or \
                                    (x == FRIDAY and (y == BLOCK_SEVEN or
                                                      y == BLOCK_EIGHT)):
                                    return False
                            # make sure non double block classes are only
                            # on evening time slots on wednesday
                            if classA != "-" and \
                                    not classA.course.double_block:
                                if x == WEDNESDAY and y < BLOCK_SEVEN:
                                    return False
        return True


placeHolder: TimeBlock = TimeBlock(identifier="placeHolder", block_type=-1,
                                   day=-1, timeslot=-1, id=-1)


def assign_timeblocks(
    schedule: Schedule,
    timeBlocks: List[TimeBlock]
) -> Schedule:
    """
    Assigns timeblocks to sections based on the schedule.
    """
    # keep track of which sections already have a start block
    startBlocks: Dict[Section, bool] = {}
    for timeBlock in timeBlocks:
        row: int = timeBlock.day
        column: int = timeBlock.timeslot
        section: Section = schedule.schedule[row][column]
        # print(section)
        if section == "-":
            continue
        print(section)
        if startBlocks.get(section) is None:
            startBlocks[section] = True
            section.start = timeBlock
        else:
            section.end = timeBlock
    print(startBlocks)
    return schedule


def assign_sections_nums(schedule: Schedule) -> Schedule:
    """
    Assigns section numbers to sections based on the schedule.
    """
    # WIP
    sectionNum = 1
    for row in schedule.schedule:
        for section in row:
            if section != "-":
                section.section_num = sectionNum
                sectionNum += 1
    return schedule


def section_as_dict(y):
    if y == "-":
        return y
    if len(y) > 1:
        return list(map(lambda x: x._asdict(), y))
    return y[0]._asdict()


def flatten_chain(matrix):
    return list(chain.from_iterable(matrix))


def solution(courses: List[Course], classrooms: List[Classroom],
             professors: List[Professor], timeBlocks: List[TimeBlock]) -> None:
    """
    Generates a schedule for the given courses, classrooms, and professors.
    """
    variableDict: Dict[Course, List[Schedule]] = {}
    # generate empty grid
    newSched = generate_grid(5, 8)
    # shuffle courses to add some randomness into generation
    shuffle(courses)
    # generate domains for all courses
    for x in courses:
        variableDict[x] = generate_domain(
            x, deepcopy(newSched), professors, classrooms)

    # run csp on generated domains
    # Variables: courses
    # Domains: all possible combinations of sections
    csp = CSP(courses, variableDict)
    csp.add_constraint(ScheduleConstraint(courses))
    genOutcome = csp.backtracking_search()
    print(genOutcome)

    # print csp's answer
    if isinstance(genOutcome, type(None)):
        print("returned none")
    else:
        # displays solution neatly
        newSched = assign_timeblocks(newSched, timeBlocks)
        schedOutput = dict_to_schedule(courses, genOutcome, newSched)
        flattened = list(filter(lambda x: x != "-", flatten_chain(list(map(
            lambda x: list(map(section_as_dict, x)), schedOutput)))))
        ids = list(map(lambda x: {
            "course_id": x["course"].id,
            "section_num": x["section_num"],
            "professor_id": x["professor"].id,
            "start": x["start"].id,
            "end": x["end"].id,
            "classroom_id": x["classroom"].id
            }, flattened))
        outputFile = sys.argv[2]
        with open(outputFile, "w") as file:
            file.write(json.dumps(ids))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 backtrackingAlgorithm.py <input-file> "
              "<output-file>")
        sys.exit(1)
    inputFile = sys.argv[1]
    # get parameters from input file
    with open(inputFile, "r") as file:
        data = yaml.safe_load(file)

    # create objects from data
    courses = [Course(**course) for course in data["courses"]]
    classrooms = [Classroom(**classroom) for classroom in data["classrooms"]]
    professors = [Professor(**professor) for professor in data["professors"]]
    timeBlocks = [TimeBlock(**timeBlock) for timeBlock in data["time_blocks"]]

    # find and print answer
    solution(courses, classrooms, professors, timeBlocks)
