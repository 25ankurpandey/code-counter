/* eslint-disable @typescript-eslint/no-require-imports */
import { Logger } from "./utils/Logger";

async function init() {
  require("dotenv").config();
  Logger.init("code-counter-svc");
  Logger.info("code-counter-svc");
  require("./main").init();
}

init();
