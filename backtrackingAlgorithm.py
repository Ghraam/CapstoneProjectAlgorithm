#!/usr/bin/env python3

class Schedule:

    def __init__(self):
        self.solution = [[None for _ in range(num_timeslots)] for _ in range(num_courses)]
        self.constraints = []
        self.load_constraints()
        
    def is_valid(self, course, timeslot):  
        # Check if assigning course to timeslot satisfies constraints
        return True

    def solve(self):
        if self.backtrack():
            return self.solution
        return None
    
    def backtrack(self):
        if self.is_complete(): 
            return True
        course = self.get_unassigned_var() 
        for timeslot in range(num_timeslots):
            if self.is_consistent(course, timeslot):
                self.solution[course][timeslot] = True 
                result = self.backtrack()
                if result:
                    return True
                self.solution[course][timeslot] = None
        return False

    def get_unassigned_var(self):
        # Return next unassigned course
        return None

    def is_complete(self):
        # Return True if all courses are assigned timeslots
        return True
        
    def is_consistent(self, course, timeslot):
        # Check if assigning course to timeslot is valid
        if self.is_valid(course, timeslot):
            return True
        return False
