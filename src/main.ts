import { Command } from "commander";
import * as path from "path";
import CodeCounter from "./services/CodeCounter";
import { getLanguageConfig } from "./config/languageConfig";
import { fileExists, getFilesInDirectory } from "./utils/fileUtils";
import { Logger } from "./utils/Logger";
import { LanguageConfig } from "./types/LanguageConfig";
import { Constants } from "./Constants/Constants";
import { languageConfigValidationSchema } from "./validationSchemas/validationSchemas";


const program = new Command();

async function init() {
    program
        .version(process.env.APP_VERSION || "1.0.0")
        .description("Counts lines of code, comments, and blank lines in a file or directory")
        .option("-f, --file <filePath>", "Path to the source file")
        .option("-d, --directory <dirPath>", "Path to the directory")
        // eslint-disable-next-line max-len
        .option("-l, --language <language>", `Language of the source file: ${process.env.FILE_EXTENSIONS || "[\"js\", \"py\", \"java\", \"ts\"]"}`)
        .parse(process.argv);

    const options = program.opts();

    if (options.file) {
        const languageConfig = getLanguageConfig(options.language);
        if (!languageConfig) {
            // eslint-disable-next-line max-len
            Logger.error(new Error(`Invalid or missing language option. Supported languages: ${process.env.FILE_EXTENSIONS || "[\"js\", \"py\"], \"java\", \"ts\"]"}.`));
            process.exit(1);
        }
        await processFile(options.file, languageConfig);
    } else if (options.directory) {
        await processDirectory(options.directory, options.language);
    } else {
        Logger.error(new Error("You must provide either a file or a directory to process."));
        process.exit(1);
    }
}

async function processFile(filePath: string, languageConfig: LanguageConfig) {
    const resolvedPath = path.resolve(filePath);

    if (!(await fileExists(resolvedPath))) {
        Logger.error(new Error(`File not found: ${resolvedPath}`));
        process.exit(1);
    }

    const codeCounter = new CodeCounter(resolvedPath, languageConfig);
    console.time(`Counting lines in ${resolvedPath}`);
    await codeCounter.countLines();
    console.timeEnd(`Counting lines in ${resolvedPath}`);
    codeCounter.printResults();
}

async function processDirectory(directoryPath: string, language?: string) {
    const resolvedPath = path.resolve(directoryPath);
    const extensions = process.env.FILE_EXTENSIONS ? process.env.FILE_EXTENSIONS.split(",") : [".js", ".py", ".java", ".ts"];
    console.time(`Counting lines in directory ${resolvedPath}`);
    const files = await getFilesInDirectory(resolvedPath, extensions);

    if (files.length === 0) {
        Logger.warn(`No valid source files found in directory: ${resolvedPath}`);
        process.exit(1);
    }

    // Filter files by language if a language is provided, otherwise process all files
    const filteredFiles = language ? filterFilesByLanguage(files, language) : files;
    const results = await Promise.allSettled(filteredFiles.map(async (file) => {
        const fileExt = path.extname(file).substring(1);
        const languageConfig = getLanguageConfig(fileExt);

        // eslint-disable-next-line max-len
        Logger.info(`Processing file: ${file}, detected extension: ${fileExt}, languageConfig: ${JSON.stringify(languageConfig)}`);

        if (!languageConfig) {
            Logger.error(new Error(`Unsupported language or file extension: ${file}`));
            throw { file, success: false, error: { message: `Unsupported file: ${file}`, file } };
        }

        // Language configuration validation
        try {
            await languageConfigValidationSchema.validateAsync(languageConfig);
        }
        catch (error) {
            Logger.error(error, { details: `Language config [${language}] validation error: ${error}` });
            // eslint-disable-next-line max-len
            throw { file, error: { name: "ValidationError", message: `Language config [${language}] validation error: ${error}` } };
        }
        return await processSingleFile(file, languageConfig);
    }));

    logResults(results);
    console.timeEnd(`Counting lines in directory ${resolvedPath}`);
}

function filterFilesByLanguage(files: string[], language: string): string[] {
    const languageConfig = getLanguageConfig(language);
    if (!languageConfig) {
        Logger.error(new Error(`Unsupported language: ${language}`));
        process.exit(1);
    }

    const validExtensions = Constants.Language_Extensions_Map[language] || [];
    return files.filter(file => validExtensions.includes(path.extname(file)));
}

async function processSingleFile(filePath: string, languageConfig: LanguageConfig) {
    const codeCounter = new CodeCounter(filePath, languageConfig);
    try {
        await codeCounter.countLines();
        return { file: filePath, success: true, codeCounter };
    } catch (error) {
        return { file: filePath, success: false, error: { message: error.message, file: filePath } };
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function logResults(results) {
    const successResults = results.filter(result => result.status === "fulfilled");
    const errorResults = results.filter(result => result.status === "rejected");

    let totalBlankLines = 0;
    let totalCommentLines = 0;
    let totalCodeLines = 0;
    let totalLines = 0;
    let totalImportLines = 0;
    let totalFunctions = 0;
    let totalClasses = 0;
    let totalVariables = 0;

    successResults.forEach(result => {
        const { codeCounter } = result.value;
        codeCounter.printResults();

        const counts = codeCounter.getCounts();
        totalBlankLines += counts.blankLines || 0;
        totalCommentLines += counts.commentLines || 0;
        totalCodeLines += counts.codeLines || 0;
        totalImportLines += counts.importLines || 0;
        totalFunctions += counts.functionDefinitions || 0;
        totalClasses += counts.classDefinitions || 0;
        totalVariables += counts.variableDeclarations || 0;
        totalLines += counts.totalLines || 0;
    });

    if (errorResults.length > 0) {
        console.log("==================== Errors Encountered ====================");
        errorResults.forEach(result => {
            const errorDetails = result.reason;
            console.log(`File Path: ${errorDetails.file}`);
            console.log(`ERROR:     ${JSON.stringify(errorDetails)}`);
            console.log("\n");
        });
        console.log("==========================================================");
    }

    console.log("\n");
    console.log("==================== Summary of Results ====================");
    console.log(`Total Files Processed: ${results.length}`);
    console.log(`Successful Processing: ${successResults.length}`);
    console.log(`Errors Encountered: ${errorResults.length}`);
    console.log("\n");

    console.log("==================== Overall Totals ======================");
    console.log("| Type       | Count                                     |");
    console.log("----------------------------------------------------------");
    console.log(`| Blank Lines              | ${totalBlankLines.toString().padEnd(27)} |`);
    console.log(`| Comment Lines            | ${totalCommentLines.toString().padEnd(27)} |`);
    console.log(`| Import Lines             | ${totalImportLines.toString().padEnd(27)} |`);
    console.log(`| Code Lines               | ${totalCodeLines.toString().padEnd(27)} |`);
    console.log(`| Function Definitions     | ${totalFunctions.toString().padEnd(27)} |`);
    console.log(`| Class Definitions        | ${totalClasses.toString().padEnd(27)} |`);
    console.log(`| Variable Declarations    | ${totalVariables.toString().padEnd(27)} |`);
    console.log(`| Total Lines              | ${totalLines.toString().padEnd(27)} |`);
    console.log("==========================================================");
}

export { init };
