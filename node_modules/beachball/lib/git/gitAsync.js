"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitEnv = exports.gitAsync = void 0;
const execa_1 = __importDefault(require("execa"));
const env_1 = require("../env");
/**
 * Run a git command asynchronously. If `verbose` is true, log the command before starting, and display
 * output on stdout (except in tests) *and* return it in the result. For tests with `verbose`, the output
 * will be logged all together to `console.log` when the command finishes (for easier mocking/capturing).
 *
 * (This utility should potentially be moved to `workspace-tools`, but it uses `execa` to capture
 * interleaved stdout/stderr, and `execa` is a large-ish dep not currently used there.)
 */
async function gitAsync(args, options) {
    const { verbose, ...execaOpts } = options;
    const { shouldLog, maxBuffer } = getGitEnv(verbose);
    const gitCmd = `git ${args.join(' ')}`;
    shouldLog && console.log(`Running: ${gitCmd}`);
    const child = (0, execa_1.default)('git', args, {
        maxBuffer,
        ...execaOpts,
        stdio: 'pipe',
        all: true,
        reject: false,
    });
    if (shouldLog === 'live') {
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
    }
    const execaResult = await child;
    const result = { ...execaResult, success: !execaResult.failed };
    const log = result.success ? console.log : console.warn;
    if (shouldLog === 'end') {
        // do the jest logging all at once in a way that can be captured by mocks
        log(result.all);
    }
    let message = `${gitCmd} ${result.success ? 'completed successfully' : `failed (code ${result.exitCode})`}`;
    if (shouldLog) {
        log(message);
    }
    else {
        message += ` - output:\n${result.all}`;
    }
    if (!result.success) {
        result.errorMessage = message;
    }
    return result;
}
exports.gitAsync = gitAsync;
function getGitEnv(verbose) {
    return {
        shouldLog: verbose || env_1.env.workspaceToolsGitDebug ? (env_1.env.isJest ? 'end' : 'live') : false,
        maxBuffer: env_1.env.workspaceToolsGitMaxBuffer || 500 * 1024 * 1024,
    };
}
exports.getGitEnv = getGitEnv;
//# sourceMappingURL=gitAsync.js.map