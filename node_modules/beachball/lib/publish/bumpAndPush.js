"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bumpAndPush = void 0;
const performBump_1 = require("../bump/performBump");
const workspace_tools_1 = require("workspace-tools");
const tagPackages_1 = require("./tagPackages");
const displayManualRecovery_1 = require("./displayManualRecovery");
const fetch_1 = require("../git/fetch");
const gitAsync_1 = require("../git/gitAsync");
const BUMP_PUSH_RETRIES = 5;
/** Use verbose logging for these steps to make it easier to debug if something goes wrong */
const verbose = true;
/**
 * Bump versions locally, commit, optionally tag, and push to git.
 */
async function bumpAndPush(bumpInfo, publishBranch, options) {
    const { path: cwd, branch, depth, gitTimeout } = options;
    const { remote, remoteBranch } = (0, workspace_tools_1.parseRemoteBranch)(branch);
    let completed = false;
    let tryNumber = 0;
    /** Log a warning which includes the attempt number */
    const logRetryWarning = (text, details = '(see above for details)') => console.warn(`[WARN ${tryNumber}/${BUMP_PUSH_RETRIES}]: ${text} ${details}`);
    while (tryNumber < BUMP_PUSH_RETRIES && !completed) {
        tryNumber++;
        console.log('-'.repeat(80));
        console.log(`Bumping versions and pushing to git (attempt ${tryNumber}/${BUMP_PUSH_RETRIES})`);
        console.log('Reverting');
        (0, workspace_tools_1.revertLocalChanges)(cwd);
        // pull in latest from origin branch
        if (options.fetch !== false) {
            console.log();
            const fetchResult = (0, fetch_1.gitFetch)({ remote, branch: remoteBranch, depth, cwd, verbose });
            if (!fetchResult.success) {
                logRetryWarning(`Fetching from ${branch} has failed!`);
                continue;
            }
        }
        console.log(`\nMerging with ${branch}...`);
        const mergeResult = await (0, gitAsync_1.gitAsync)(['merge', '-X', 'theirs', branch], { cwd, verbose });
        if (!mergeResult.success) {
            logRetryWarning(`Merging with latest ${branch} has failed!`);
            continue;
        }
        // bump the version
        console.log('\nBumping versions locally (and writing changelogs if requested)');
        await (0, performBump_1.performBump)(bumpInfo, options);
        // checkin
        if (!(await mergePublishBranch(publishBranch, options))) {
            logRetryWarning('Merging to target has failed!');
            continue;
        }
        // create git tags
        console.log('\nCreating git tags for new versions...');
        (0, tagPackages_1.tagPackages)(bumpInfo, options);
        // push
        console.log(`\nPushing to ${branch}...`);
        const pushResult = await (0, gitAsync_1.gitAsync)(['push', '--no-verify', '--follow-tags', '--verbose', remote, `HEAD:${remoteBranch}`], { cwd, verbose, timeout: gitTimeout });
        if (pushResult.success) {
            completed = true;
        }
        else if (pushResult.timedOut) {
            logRetryWarning(`Pushing to ${branch} has timed out!`);
        }
        else {
            logRetryWarning(`Pushing to ${branch} has failed!`);
        }
    }
    if (!completed) {
        (0, displayManualRecovery_1.displayManualRecovery)(bumpInfo);
        process.exit(1);
    }
}
exports.bumpAndPush = bumpAndPush;
async function mergePublishBranch(publishBranch, options) {
    await options.hooks?.precommit?.(options.path);
    console.log(`\nMerging ${publishBranch} into ${options.branch}...`);
    const mergeSteps = [
        ['add', '.'],
        ['commit', '-m', options.message],
        ['checkout', options.branch],
        ['merge', '-X', 'ours', publishBranch],
    ];
    for (const step of mergeSteps) {
        const result = await (0, gitAsync_1.gitAsync)(step, { cwd: options.path, verbose });
        if (!result.success) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=bumpAndPush.js.map