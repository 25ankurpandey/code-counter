// languageConfig.ts
import { LanguageConfig } from "../types/LanguageConfig";


export const typescriptConfig: LanguageConfig = {
    singleLineComment: "//",
    multiLineCommentStart: "/*",
    multiLineCommentEnd: "*/",
    importRegex: /^(import|require)\s+/,
    variableDeclarationRegex: /^(let|const|var|public|private|protected)\s+\w+/,
    functionDefinitionRegex: /^\s*(public|private|protected|static)?\s*(async\s*)?[\w]+\s*\([^)]*\)\s*({|=>)/,
    classDefinitionRegex: /^\s*(export\s+)?(abstract\s+)?class\s+\w+/,
};

export const javascriptConfig: LanguageConfig = {
    singleLineComment: "//",
    multiLineCommentStart: "/*",
    multiLineCommentEnd: "*/",
    importRegex: /^\s*(import|require)\s+['"\w{}*]+\s*from?\s*['"\w./\-]+/,
    variableDeclarationRegex: /^\s*(let|const|var)\s+[\w\s{},=\[\]]+/,
    functionDefinitionRegex: /^\s*(async\s*)?(function\s+)?\w+\s*\([^)]*\)\s*{/,
    classDefinitionRegex: /^\s*(export\s+)?class\s+\w+/,
};

export const pythonConfig: LanguageConfig = {
    singleLineComment: "#",
    importRegex: /^\s*(import|from)\s+[\w.]+\s*(import\s+\w+)?/,
    variableDeclarationRegex: /^\s*\w+\s*=\s*.+/,
    functionDefinitionRegex: /^\s*def\s+\w+\s*\([^)]*\)\s*:/,
    classDefinitionRegex: /^\s*class\s+\w+\s*\(?.*\)?:/,
};

export const javaConfig: LanguageConfig = {
    singleLineComment: "//",
    multiLineCommentStart: "/*",
    multiLineCommentEnd: "*/",
    importRegex: /^\s*import\s+[\w.*]+;/,
    variableDeclarationRegex: /^\s*(int|float|double|char|String|boolean|List<\w+>|Map<[\w,]+>)\s+\w+/,
    functionDefinitionRegex: /^\s*(public|private|protected|static|final)?\s*[\w<>]+\s+\w+\s*\([^)]*\)\s*{/,
    classDefinitionRegex: /^\s*(public\s+)?(abstract\s+)?(class|interface|enum)\s+\w+/,
};

// More language configs can be added here

export function getLanguageConfig(language: string): LanguageConfig | null {
    const languageConfigMap: Record<string, LanguageConfig> = {
        js: javascriptConfig,
        ts: typescriptConfig,
        py: pythonConfig,
        java: javaConfig,
        // Add more languages here as needed.
    };

    return languageConfigMap[language] || null;
}
