const chalk = {
  blue: (t) => `\x1b[34m${t}\x1b[0m`,
  green: (t) => `\x1b[32m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  red: (t) => `\x1b[31m${t}\x1b[0m`,
  gray: (t) => `\x1b[90m${t}\x1b[0m`,
};

const timestamp = () => new Date().toISOString();

const logger = {
  info: (...args) => console.log(chalk.blue(`[${timestamp()}] INFO:`), ...args),
  success: (...args) => console.log(chalk.green(`[${timestamp()}] ✅`), ...args),
  warn: (...args) => console.warn(chalk.yellow(`[${timestamp()}] WARN:`), ...args),
  error: (...args) => console.error(chalk.red(`[${timestamp()}] ERROR:`), ...args),
  debug: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(chalk.gray(`[${timestamp()}] DEBUG:`), ...args);
    }
  }
};

module.exports = logger;
