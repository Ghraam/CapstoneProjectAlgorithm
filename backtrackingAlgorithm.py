#!/usr/bin/env python3
# calendar.py
# Solve the scheduling problem using the backtracking search algorithm (using the CSP class from csp.py)

from csp import CSP, Constraint

class Calendar:
    def __init__(self, variables):
        self.variables = variables
        self.csp = CSP(self.variables, {v: list(range(1, 32)) for v in self.variables})
        self.csp.add_constraint(AllDifferentConstraint(self.variables))

    def solve(self):
        solution = self.csp.backtracking_search()
        if solution is None:
            print("No solution found!")
        else:
            print(solution)
            
class AllDifferentConstraint(Constraint):
    def __init__(self, variables):
        super().__init__(variables)
        self.variables = variables

    def satisfied(self, assignment):
        # If there are any duplicates variables, then there is an assignment failure
        assigned_values = list(assignment.values())
        return len(assigned_values) == len(set(assigned_values))
    
if __name__ == "__main__":
    calendar = Calendar(['A', 'B', 'C', 'D'])
    calendar.solve()