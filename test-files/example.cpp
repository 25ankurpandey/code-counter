// This is a simple C++ program
#include <iostream>

using namespace std;

// Class definition
class Example {
public:
    // Method to greet
    void greet() {
        cout << "Hello, World!" << endl; // Print greeting
    }

    // Method to add two numbers
    int add(int a, int b) {
        return a + b; // Return the sum
    }
};

// Main function
int main() {
    Example example; // Create an instance of the Example class
    example.greet(); // Call the greet method

    int sum = example.add(5, 10); // Call the add method
    cout << "Sum: " << sum << endl; // Print the sum

    /*
     * This is a multi-line comment.
     * It spans multiple lines.
     */
    return 0; // Indicate successful completion
}
