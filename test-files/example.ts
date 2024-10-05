// This is a single-line comment in TypeScript
import { Logger } from "../src/utils/Logger"; // Import statement

/* 
   Multi-line comment: 
   TypeScript allows using typed variables
*/
export class MyClass {
    // A public variable declaration with type
    public myVariable: number = 5;

    /* 
       A multi-line comment describing the function below:
       This function takes two parameters and logs them.
    */
    public myFunction(arg1: string, arg2: number): void {
        Logger.info("Info log");
    }

    // Another function declaration using async
    public async fetchData(url: string): Promise<string> {
        const response = await fetch(url);
        return await response.text();
    }
}
