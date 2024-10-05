# This is a single-line comment in Python

import os
from math import sqrt  # Importing modules

"""
Multi-line comment (or docstring):
Python does not require explicit variable declaration.
The types are inferred at runtime.
"""
x = 10  # An integer variable
y = "Hello"  # A string variable

def add(a, b):
    """
    Function to add two numbers
    """
    return a + b

class MyClass:
    """
    A simple class that has a counter and methods
    """
    def __init__(self):
        self.value = 0

    def increment(self):
        """
        Method to increment the counter
        """
        self.value += 1
