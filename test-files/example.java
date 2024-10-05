// This is a single-line comment in Java

import java.util.List;

/* 
   Multi-line comment:
   Java is a statically typed language,
   so variables must be declared with their types.
*/
public class example {
    // A private variable declaration
    private int count;

    /*
       A constructor that initializes the count variable.
    */
    public example() {
        this.count = 0;
    }

    // A method to increment the count variable
    public void increment() {
        this.count++;
    }

    /* 
       Another method to print the count
    */
    public void printCount() {
        System.out.println("Count: " + this.count);
    }
}
