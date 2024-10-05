import * as fs from "fs/promises";
import * as path from "path";
import { Logger } from "./Logger";

export const fileExists = async (filePath: string): Promise<boolean> => {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
};

export const readFileAsLines = async (filePath: string): Promise<string[]> => {
    try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        return fileContent.split("\n");
    } catch (error) {
        Logger.error(error, { details: `Error reading file ${filePath}` });
        throw error;
    }
};

export const getFilesInDirectory = async (directoryPath: string, extensions: string[]): Promise<string[]> => {
    const fileList: string[] = [];
    const stack: string[] = [directoryPath];

    while (stack.length > 0) {
        const currentDir = stack.pop()!;
        let items: string[];

        try {
            items = await fs.readdir(currentDir);
        } catch (error) {
            console.error(`Error reading directory ${currentDir}:`, error);
            continue; 
        }

        const filePromises = items.map(async (item) => {
            const fullPath = path.join(currentDir, item);
            let stats;

            try {
                stats = await fs.stat(fullPath);
            } catch (error) {
                console.error(`Error getting stats for ${fullPath}:`, error);
                return;
            }

            if (stats.isDirectory()) {
                stack.push(fullPath);
            } else if (extensions.includes(path.extname(item))) {
                return fullPath;
            }
        });

        const results = await Promise.all(filePromises);
        fileList.push(...results.filter((file): file is string => file !== undefined));
    }

    return fileList;
};
