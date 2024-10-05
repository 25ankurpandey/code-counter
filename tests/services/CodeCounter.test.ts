import CodeCounter from "../../src/services/CodeCounter";
import { javascriptConfig } from "../../src/config/languageConfig";
import * as fileUtils from "../../src/utils/fileUtils";
import { Logger } from "../../src/utils/Logger";

jest.mock("../../src/utils/Logger");

describe("CodeCounter", () => {
    let codeCounter: CodeCounter;
    const mockFilePath = "path/to/test/file.js";

    beforeEach(() => {
        codeCounter = new CodeCounter(mockFilePath, javascriptConfig);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should throw an error when reading file fails", async () => {
        jest.spyOn(fileUtils, "readFileAsLines").mockRejectedValue(new Error("File read error"));

        await expect(codeCounter.countLines()).rejects.toThrow("File read error");
        expect(Logger.error).toHaveBeenCalledWith(expect.any(Error), { details: `Failed to read file: ${mockFilePath}` });
    });

    it("should count multi-line comments that do not end on the same line", async () => {
        jest.spyOn(fileUtils, "readFileAsLines").mockResolvedValue([
            "/* this is a multi-line comment",
            "   it continues here */",
            "const x = 10;"
        ]);
    
        await codeCounter.countLines();
    
        expect(codeCounter.getCounts()).toEqual({
            blankLines: 0,
            commentLines: 2, 
            codeLines: 1,
            totalLines: 3, 
        });
    });
    

    it("should count only multi-line comments correctly", async () => {
        jest.spyOn(fileUtils, "readFileAsLines").mockResolvedValue([
            "/* this is a multi-line comment",
            "   it spans multiple lines */",
        ]);

        await codeCounter.countLines();

        expect(codeCounter.getCounts()).toEqual({
            blankLines: 0,
            commentLines: 2,
            codeLines: 0,
            totalLines: 2,
        });
    });

    it("should count multi-line comments that end on a different line", async () => {
        jest.spyOn(fileUtils, "readFileAsLines").mockResolvedValue([
            "/* this is a multi-line comment",
            "   it continues here",
            "*/",
            "const x = 10;"
        ]);
    
        await codeCounter.countLines();
    
        expect(codeCounter.getCounts()).toEqual({
            blankLines: 0,
            commentLines: 3,
            codeLines: 1, 
            totalLines: 4,
        });
    });
    
    it("should handle nested or improperly terminated multi-line comments", async () => {
        jest.spyOn(fileUtils, "readFileAsLines").mockResolvedValue([
            "/* start",
            "   /* nested comment",
            "   end */",
            "const y = 20;",
        ]);
    
        await codeCounter.countLines();
    
        expect(codeCounter.getCounts()).toEqual({
            blankLines: 0,
            commentLines: 3,
            codeLines: 1,
            totalLines: 4,
        });
    });
    

    it("should return correct counts with getCounts", async () => {
        jest.spyOn(fileUtils, "readFileAsLines").mockResolvedValue([
            "// comment", 
            "const x = 10;", 
            "", 
            "let y = 20;"
        ]);

        await codeCounter.countLines();

        const counts = codeCounter.getCounts();
        expect(counts).toEqual({
            blankLines: 1,
            commentLines: 1,
            codeLines: 2,
            totalLines: 4,
        });
    });

    it("should print results correctly with all relevant console.logs", async () => {
        jest.spyOn(fileUtils, "readFileAsLines").mockResolvedValue([
            "// comment", 
            "const x = 10;", 
            "", 
            "let y = 20;"
        ]);

        await codeCounter.countLines();
        const logSpy = jest.spyOn(console, "log");

        codeCounter.printResults();

        expect(logSpy).toHaveBeenCalledWith("==================== Results for File ====================");
        expect(logSpy).toHaveBeenCalledWith(`File Path: ${mockFilePath}`);
        expect(logSpy).toHaveBeenCalledWith("----------------------------------------------------------");
        expect(logSpy).toHaveBeenCalledWith("| Type       | Count                                     |");
        expect(logSpy).toHaveBeenCalledWith("----------------------------------------------------------");
        expect(logSpy).toHaveBeenCalledWith(`| Blank      | 1                                        |`);
        expect(logSpy).toHaveBeenCalledWith(`| Comments   | 1                                        |`);
        expect(logSpy).toHaveBeenCalledWith(`| Code       | 2                                        |`);
        expect(logSpy).toHaveBeenCalledWith("| Total      | 4                                        |");
        expect(logSpy).toHaveBeenCalledWith("----------------------------------------------------------");
        expect(logSpy).toHaveBeenCalledWith("==========================================================");
        expect(logSpy).toHaveBeenCalledWith("\n");
    });
});
