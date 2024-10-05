# Code Counter

## Description

The **Code Counter** is a command-line tool designed to count lines of code, comments, and blank lines in a source file or directory. It supports multiple programming languages and employs **parallel and asynchronous processing** to enhance performance, making it a versatile tool for developers seeking insights into their codebase.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Available Commands](#available-commands)
- [Logging](#logging)
- [Testing](#testing)

## Features

- Count blank lines, comment lines, import lines, code lines, function definitions, class definitions, and variable declarations.
- Support for multiple programming languages including JavaScript, TypeScript, Python, and Java.
- Command-line interface for easy interaction.
- Configurable logging mechanism for debugging and information purposes.
- **Parallel and asynchronous processing**: The Code Counter leverages asynchronous and parallel processing to efficiently handle large files and multiple directories. This allows the tool to analyze files concurrently, significantly reducing the time required to count lines across extensive codebases.
By processing files in parallel, the tool ensures optimal performance, making it ideal for projects with numerous source files or extensive directories.

## Installation

1. **Clone the Repository:** `git clone https://github.com/25ankurpandey/code-counter.git`
2. **Install Dependencies:** Make sure you have Node.js (version 14 or higher) and npm installed. Then, run: `npm install`
3. **Set Up Environment Variables:**  Create a .env file in the root directory of the project and configure your environment variables. You can set the FILE_EXTENSIONS variable to define the file types you want to support.
    `FILE_EXTENSIONS=".js,.py,.java,.ts"`
    `APP_VERSION="1.0.0"`
    `LOG_LEVEL="info"`
    `LOG_TRANSPORT_FILE=false`

## Configuration
- The language configurations are defined in the src/config/languageConfig.ts file.
- Add support for more languages by extending the languageConfigMap object.

## Usage
You can run the code counter from the command line. Here’s how to use it:
    -`npm start -- [options]`

**Available Commands**
- Count lines in a file: `npm start -- --file <filePath> --language <language>`
- Count lines in a directory: `npm start -- --directory <dirPath> --language <language>` (If no language is passed in the command, whole directory will be scanned for all the supported file types. Otherwise only the given language files will be scanned).
- Options:
        `-f, --file <filePath>`: Path to the source file you want to analyze.
        `-d, --directory <dirPath>`: Path to the directory containing source files.
        `-l, --language <language>`: Language of the source file (e.g., js, py, java, ts).

## Example usage
- To count lines in a JavaScript file:
    - `npm start -- --file ./src/example.js --language js`
- To count lines in a directory containing TypeScript files:
    - `npm start -- --directory ./src --language ts`

## Logging
The project uses the Winston library for logging. The log level can be adjusted through the LOG_LEVEL environment variable in the .env file.

Log messages will be printed to the console by default. If LOG_TRANSPORT_FILE is set to true, logs will also be written to a service.log file in the project root.


## Testing
You can run tests using Jest. The following commands are available:
- To run all tests:
    - `npm run test`
- To run tests with coverage:
    - `npm run test:coverage`
