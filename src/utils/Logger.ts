/* eslint-disable @typescript-eslint/no-explicit-any */
import * as path from "path";
import * as winston from "winston";

export class Logger {
    private static logger: winston.Logger | null = null;
    private static initialized = false;
    private static nodeEnvLocal = false;

    public static init(service: string) {
        const nodeEnv: string = process.env.NODE_ENV ?? "development";
        const MESSAGE: symbol = Symbol.for("message");

        const jsonFormatter = (logEntry: any) => {
            const json: any = {
                timestamp: new Date().toISOString(),
                serviceName: service,
                level: logEntry.level,
                message: logEntry.message,
                data: logEntry.data || "not_provided"
            };
            logEntry[MESSAGE] = JSON.stringify(json);
            return logEntry;
        };

        const isTransportFile: boolean = !!process.env.LOG_TRANSPORT_FILE;

        if (!nodeEnv || nodeEnv === "local") {
            Logger.nodeEnvLocal = true;
            Logger.logger = winston.createLogger({
                level: "silly",
                format: winston.format(jsonFormatter)(),
                transports: [new winston.transports.Console()]
            });
        } else {
            let transport: winston.transport = new winston.transports.Console();

            if (isTransportFile) {
                transport = new winston.transports.File({
                    filename: `${path.resolve(process.cwd())}/service.log`,
                    maxsize: 10485760, // 10MB
                });
            }

            Logger.logger = winston.createLogger({
                level: process.env.LOG_LEVEL ?? "info",
                format: winston.format(jsonFormatter)(),
                transports: [transport],
            });
        }

        Logger.initialized = true;
    }

    static log(level: string, message: string, data: { [key: string]: any } = {}) {
        if (!Logger.initialized) {
            throw new Error("The logger has not been initialized. Please call Logger.init() first.");
        }

        if (Logger.logger) {
            const logData: winston.LogEntry = {
                level,
                message: message || "not_provided",
                data: Object.keys(data).length > 0 ? data : "not_provided",
                timestamp: new Date().toISOString(),
            };

            Logger.logger.log(logData);
        }
    }

    public static silly(message: string, data: { [key: string]: any } = {}) {
        Logger.log("silly", message, data);
    }

    public static debug(message: string, data: { [key: string]: any } = {}) {
        Logger.log("debug", message, data);
    }

    public static info(message: string, data: { [key: string]: any } = {}) {
        Logger.log("info", message, data);
    }

    public static warn(message: string, data: { [key: string]: any } = {}) {
        Logger.log("warn", message, data);
    }

    public static error(err: Error, data: { [key: string]: any } = {}) {
        const errMsg = err.message || "unknown_error";
        Logger.log("error", `${err.stack}`, { ...data, errMsg });
    }
}