import { LanguageConfig } from "../types/LanguageConfig";
import { readFileAsLines } from "../utils/fileUtils";
import { Logger } from "../utils/Logger";

class CodeCounter {
    private blankLines: number = 0;
    private commentLines: number = 0;
    private codeLines: number = 0;
    private totalLines: number = 0;
    private importLines: number = 0;
    private variableDeclarations: number = 0;
    private functionDefinitions: number = 0;
    private classDefinitions: number = 0;
    private languageConfig: LanguageConfig;

    constructor(private filePath: string, languageConfig: LanguageConfig) {
        this.languageConfig = languageConfig;
    }

    public async countLines(): Promise<void> {
        let lines: string[];
        try {
            lines = await readFileAsLines(this.filePath);
        } catch (error) {
            Logger.error(error, { details: `Failed to read file: ${this.filePath}` });
            throw error;
        }
        this.totalLines = lines.length;

        let insideMultiLineComment = false;

        for (const line of lines) {
            const trimmedLine = line.trim();

            // Check for blank lines
            if (trimmedLine === "") {
                this.blankLines++;
            }
            // Check for multi-line comment start
            else if (this.languageConfig.multiLineCommentStart &&
                     trimmedLine.startsWith(this.languageConfig.multiLineCommentStart)) {
                this.commentLines++;
                insideMultiLineComment = true;
                if (this.languageConfig.multiLineCommentEnd && trimmedLine.endsWith(this.languageConfig.multiLineCommentEnd)) {
                    insideMultiLineComment = false;
                }
            }
            // Check for multi-line comment end
            else if (insideMultiLineComment && this.languageConfig.multiLineCommentEnd &&
                     trimmedLine.endsWith(this.languageConfig.multiLineCommentEnd)) {
                this.commentLines++;
                insideMultiLineComment = false;
            }
            // Handle ongoing multi-line comment
            else if (insideMultiLineComment) {
                this.commentLines++;
            }
            // Check for single-line comments
            else if (trimmedLine.startsWith(this.languageConfig.singleLineComment)) {
                this.commentLines++;
            }
            // Check for imports
            else if (this.languageConfig.importRegex && this.languageConfig.importRegex.test(trimmedLine)) {
                this.importLines++;
            }
            // Check for variable declarations
            else if (this.languageConfig.variableDeclarationRegex && this.languageConfig.variableDeclarationRegex.test(trimmedLine)) {
                this.variableDeclarations++;
            }
            // Check for function definitions
            else if (this.languageConfig.functionDefinitionRegex && this.languageConfig.functionDefinitionRegex.test(trimmedLine)) {
                this.functionDefinitions++;
            }
            // Check for class definitions
            else if (this.languageConfig.classDefinitionRegex && this.languageConfig.classDefinitionRegex.test(trimmedLine)) {
                this.classDefinitions++;
            }
            // Else count as code
            else {
                this.codeLines++;
            }
        }
    }

    public getCounts() {
        return {
            blankLines: this.blankLines,
            commentLines: this.commentLines,
            codeLines: this.codeLines,
            totalLines: this.totalLines,
            importLines: this.importLines,
            variableDeclarations: this.variableDeclarations,
            functionDefinitions: this.functionDefinitions,
            classDefinitions: this.classDefinitions,
        };
    }

    public printResults(): void {
        console.log("==================== Results for File ====================");
        console.log(`File Path: ${this.filePath}`);
        console.log("----------------------------------------------------------");
        console.log("| Type                  | Count                          |");
        console.log("----------------------------------------------------------");
        console.log(`| Blank Lines              | ${this.blankLines.toString().padEnd(27)} |`);
        console.log(`| Comment Lines            | ${this.commentLines.toString().padEnd(27)} |`);
        console.log(`| Import Lines             | ${this.importLines.toString().padEnd(27)} |`);
        console.log(`| Variable Declarations    | ${this.variableDeclarations.toString().padEnd(27)} |`);
        console.log(`| Function Definitions     | ${this.functionDefinitions.toString().padEnd(27)} |`);
        console.log(`| Class Definitions        | ${this.classDefinitions.toString().padEnd(27)} |`);
        console.log(`| Code Lines               | ${this.codeLines.toString().padEnd(27)} |`);
        console.log(`| Total Lines              | ${this.totalLines.toString().padEnd(27)} |`);
        console.log("----------------------------------------------------------");
        console.log("==========================================================");
        console.log("\n");
    }
}

export default CodeCounter;
