export interface LanguageConfig {
    singleLineComment?: string;
    multiLineCommentStart?: string;
    multiLineCommentEnd?: string;
    importRegex?: RegExp; 
    variableDeclarationRegex?: RegExp;
    functionDefinitionRegex?: RegExp;
    classDefinitionRegex?: RegExp;
}
