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
import yaml
import json
import sys

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
    corresponding_block: int  # id of corresponding block (-1 if null)


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


def dict_to_schedule(variables, dict, schedule: List[Section]
                     ) -> List[Section]:
    """
    Converts a dictionary to a schedule, with making lists of sections in
    positions that allow for multiple classes in the same timeslot.
    """
    newSched = deepcopy(schedule)
    domains = [dict[i] for i in variables]
    while len(newSched) < len(domains[0]):
        newSched.append("-")
    for domain in domains:
        for x in range(len(domain)):
            if domain[x] != "-":
                if newSched[x] == "-":
                    newSched[x] = [domain[x]]
                else:
                    newSched[x].append(domain[x])
    return newSched[0]


SINGLE = 0
DOUBLE_START = 1
DOUBLE_END = 2


def block_conditions(course: Course, classroom: Classroom,
                     professor: Professor, start: TimeBlock, end: TimeBlock
                     ) -> bool:
    match course.double_block:
        case 1:
            return start.day == end.day and \
                start.timeslot == end.timeslot - 1 and \
                ((start.block_type == DOUBLE_START and
                    end.block_type == DOUBLE_END) or
                    (start.block_type == SINGLE and
                     end.block_type == SINGLE))
        case 0:
            return start.corresponding_block == end.id and \
                start.day < end.day and \
                start.block_type == SINGLE and \
                end.block_type == SINGLE
        case _:
            print(course.double_block)
            raise Exception("Houston, we have a problem!")


def generate_domain(course: Course, section_num: int, schedule: List[Section],
                    prof: List[Professor], classrooms: List[Classroom],
                    timeBlocks: List[TimeBlock]) -> List[List[Section]]:
    """
    Generates a domain consisting of all possible combinations of sections.
    """
    professors = deepcopy(prof)

    domain: List[List[Section]] = []

    for classroom in classrooms:
        for professor in professors:
            for start in timeBlocks:
                for end in timeBlocks:
                    if block_conditions(course, classroom, professor,
                                        start, end):
                        section = Section(classroom=classroom, course=course,
                                          professor=professor, start=start,
                                          end=end, section_num=section_num)
                        tempCopy = deepcopy(schedule)
                        tempCopy.append(section)
                        domain.append(tempCopy)
    return domain


class ScheduleConstraint(Constraint[tuple[Course, int], List[Section]]):
    # can't have same class twice on same day
    # can't have same class twice on same time slot
    # can't have overlapping classes in the same classroom
    def __init__(self, variables: List[tuple[Course, int]]) -> None:
        self.variables: List[(Course, int)] = variables

    def satisfied(self, assignment: Dict) -> bool:
        classroom_professor: set[(Classroom, Professor)] = set()
        timeblock_professor: set[(TimeBlock, Professor)] = set()
        for (course, section_num) in self.variables:
            if assignment.get((course, section_num)) is None:
                continue
            sections: List[Section] = assignment[(course, section_num)]
            for section in sections:
                # print(section)
                if (section.classroom, section.professor) in \
                   classroom_professor:
                    return False
                classroom_professor.add((section.classroom, section.professor))
                if (section.start, section.professor) in timeblock_professor:
                    return False
                timeblock_professor.add((section.start, section.professor))
                if (section.end, section.professor) in timeblock_professor:
                    return False
                timeblock_professor.add((section.end, section.professor))
        return True


def processSection(x):
    if type(x) is list:
        if len(x) > 1:
            return list(map(processSection, x))
        return processSection(x[0])
    if type(x) is not dict:
        print("not dict\n")
        print(type(x), "\n")
        print(x, "\n")
        return x
    return {
        "course_id": x["course"].id,
        "section_num": x["section_num"],
        "professor_id": x["professor"].id,
        "start": x["start"].id,
        "end": x["end"].id,
        "classroom_id": x["classroom"].id
    }


def solution(courses: List[Course], classrooms: List[Classroom],
             professors: List[Professor], timeBlocks: List[TimeBlock]) -> None:
    """
    Generates a schedule for the given courses, classrooms, and professors.
    """
    variableDict: Dict[(Course, int), List[List[Section]]] = {}
    # generate empty grid
    newSched: List[Section] = []
    # shuffle courses to add some randomness into generation
    shuffle(courses)
    # generate domains for all courses
    for x in courses:
        for i in range(2):
            variableDict[(x, i+1)] = generate_domain(
                x, i+1, deepcopy(newSched), professors, classrooms, timeBlocks)

    # run csp on generated domains
    # Variables: courses
    # Domains: all possible combinations of sections
    # Considering change to CSP:
    # Variables: List[(Section, int)]
    # Domains: Dict[Section, List[Schedule]]
    variables = [(course, i+1) for course in courses for i in range(2)]
    # print(variableDict)
    csp = CSP(variables, variableDict)
    csp.add_constraint(ScheduleConstraint(variables))
    genOutcome = csp.backtracking_search()
    # print(genOutcome)

    # print csp's answer
    if isinstance(genOutcome, type(None)):
        print("returned none")
    else:
        # displays solution neatly
        schedOutput = dict_to_schedule(variables, genOutcome, newSched)
        formatted = list(map(processSection, list(map(lambda x: x._asdict(),
                                                      schedOutput))))
        print(formatted)
        outputFile = sys.argv[2]
        with open(outputFile, "w") as file:
            file.write(json.dumps(formatted, indent=4))


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
