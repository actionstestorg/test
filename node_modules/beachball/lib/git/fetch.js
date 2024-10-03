"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitFetch = void 0;
const workspace_tools_1 = require("workspace-tools");
const gitAsync_1 = require("./gitAsync");
/**
 * Wrapper for `git fetch`. If `verbose` is true, log the command before starting, and display output
 * on stdout (except in tests). In tests with `verbose`, the output will be logged all together to
 * `console.log` when the command finishes (for easier mocking/capturing).
 */
function gitFetch(params) {
    const { remote, branch, depth, deepen, unshallow, cwd, verbose } = params;
    const { shouldLog } = (0, gitAsync_1.getGitEnv)(verbose);
    if ([depth, deepen, unshallow].filter(v => v !== undefined).length > 1) {
        throw new Error('"depth", "deepen", and "unshallow" are mutually exclusive');
    }
    const extraArgs = depth ? [`--depth=${depth}`] : deepen ? [`--deepen=${deepen}`] : unshallow ? ['--unshallow'] : [];
    let description = remote
        ? `Fetching ${branch ? `branch "${branch}" from ` : ''}remote "${remote}"`
        : 'Fetching all remotes';
    if (extraArgs.length) {
        description += ` (with ${extraArgs.join(' ')})`;
    }
    shouldLog && console.log(description + '...');
    const result = (0, workspace_tools_1.git)([
        'fetch',
        ...extraArgs,
        // If the remote is unknown, don't specify the branch (fetching a branch without a remote is invalid)
        ...(remote && branch ? [remote, branch] : remote ? [remote] : []),
    ], { cwd, stdio: shouldLog === 'live' ? 'inherit' : 'pipe' });
    const log = result.success ? console.log : console.warn;
    // do the jest logging all at once in a way that can be captured by mocks (jest can't mock process.stdout/err)
    if (shouldLog === 'end') {
        result.stdout && console.log(result.stdout);
        result.stderr && log(result.stderr);
    }
    let message = `${description} ${result.success ? 'completed successfully' : `failed (code ${result.status})`}`;
    if (shouldLog) {
        log(message);
        message += ' - see above for details';
    }
    else if (result.stdout && result.stderr) {
        message += `\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`;
    }
    else if (result.stdout || result.stderr) {
        message += ` - output:\n${result.stdout || result.stderr}`;
    }
    if (!result.success) {
        result.errorMessage = message;
    }
    return result;
}
exports.gitFetch = gitFetch;
//# sourceMappingURL=fetch.js.map