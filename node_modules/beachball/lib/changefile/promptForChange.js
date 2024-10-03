"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._getChangeFileInfoFromResponse = exports._promptForPackageChange = exports._getQuestionsForPackage = exports.promptForChange = void 0;
const prompts_1 = __importDefault(require("prompts"));
const semver_1 = require("semver");
const isValidChangeType_1 = require("../validation/isValidChangeType");
const getDisallowedChangeTypes_1 = require("./getDisallowedChangeTypes");
/**
 * Uses `prompts` package to prompt for change type and description.
 * (For easier testing, this function does not handle filesystem access.)
 */
async function promptForChange(params) {
    const { changedPackages, email, options } = params;
    if (!changedPackages.length) {
        return;
    }
    // Get the questions for each package first, in case one package has a validation issue
    const packageQuestions = {};
    for (const pkg of changedPackages) {
        const questions = _getQuestionsForPackage({ pkg, ...params });
        if (!questions) {
            return; // validation issue
        }
        packageQuestions[pkg] = questions;
    }
    // Now prompt for each package
    const packageChangeInfo = [];
    for (let pkg of changedPackages) {
        const response = await _promptForPackageChange(packageQuestions[pkg], pkg);
        if (!response) {
            return; // user cancelled
        }
        const change = _getChangeFileInfoFromResponse({ response, pkg, email, options });
        if (!change) {
            return; // validation issue
        }
        packageChangeInfo.push(change);
    }
    return packageChangeInfo;
}
exports.promptForChange = promptForChange;
/**
 * Build the list of questions to ask the user for this package.
 * @internal exported for testing
 */
function _getQuestionsForPackage(params) {
    const { pkg, packageInfos, packageGroups, options, recentMessages } = params;
    const disallowedChangeTypes = (0, getDisallowedChangeTypes_1.getDisallowedChangeTypes)(pkg, packageInfos, packageGroups);
    if (options.type && disallowedChangeTypes?.includes(options.type)) {
        console.error(`Change type "${options.type}" is not allowed for package "${pkg}"`);
        return;
    }
    const packageInfo = packageInfos[pkg];
    const showPrereleaseOption = !!(0, semver_1.prerelease)(packageInfo.version);
    const changeTypeChoices = [
        ...(showPrereleaseOption ? [{ value: 'prerelease', title: ' [1mPrerelease[22m - bump prerelease version' }] : []),
        { value: 'patch', title: ' [1mPatch[22m      - bug fixes; no API changes.' },
        { value: 'minor', title: ' [1mMinor[22m      - small feature; backwards compatible API changes.' },
        {
            value: 'none',
            title: ' [1mNone[22m       - this change does not affect the published package in any way.',
        },
        { value: 'major', title: ' [1mMajor[22m      - major feature; breaking changes.' },
    ].filter(choice => !disallowedChangeTypes?.includes(choice.value));
    if (!changeTypeChoices.length) {
        console.error(`No valid change types available for package "${pkg}"`);
        return;
    }
    const changeTypePrompt = {
        type: 'select',
        name: 'type',
        message: 'Change type',
        choices: changeTypeChoices,
    };
    // Do case-insensitive filtering of recent commit messages
    const recentMessageChoices = recentMessages.map(msg => ({ title: msg }));
    const getSuggestions = (input) => input
        ? recentMessageChoices.filter(({ title }) => title.toLowerCase().startsWith(input.toLowerCase()))
        : recentMessageChoices;
    const descriptionPrompt = {
        type: 'autocomplete',
        name: 'comment',
        message: 'Describe changes (type or choose one)',
        choices: recentMessageChoices,
        suggest: (input) => Promise.resolve(getSuggestions(input)),
        // prompts doesn't have proper support for "freeform" input (value not in the list), and the
        // previously implemented hack of adding the input to the returned list from `suggest`
        // no longer works. So this new hack adds the current input as the fallback.
        // https://github.com/terkelg/prompts/issues/131
        onState: function (state) {
            // If there are no suggestions, update the value to match the input, and unset the fallback
            // (this.suggestions may be out of date if the user pasted text ending with a newline, so re-calculate)
            if (!getSuggestions(this.input).length) {
                this.value = this.input;
                this.fallback = '';
            }
        },
    };
    const showChangeTypePrompt = !options.type && changeTypePrompt.choices.length > 1;
    const defaultPrompt = {
        changeType: showChangeTypePrompt ? changeTypePrompt : undefined,
        description: !options.message ? descriptionPrompt : undefined,
    };
    const defaultPrompts = [defaultPrompt.changeType, defaultPrompt.description];
    return (packageInfo.combinedOptions.changeFilePrompt?.changePrompt?.(defaultPrompt, pkg) || defaultPrompts).filter((q) => !!q);
}
exports._getQuestionsForPackage = _getQuestionsForPackage;
/**
 * Do the actual prompting.
 * @internal exported for testing
 */
async function _promptForPackageChange(questions, pkg) {
    if (!questions.length) {
        // This MUST return an empty object rather than nothing, because returning nothing means the
        // prompt was cancelled and the whole change prompt process should end
        return {};
    }
    console.log('');
    console.log(`Please describe the changes for: ${pkg}`);
    let isCancelled = false;
    const onCancel = () => {
        isCancelled = true;
    };
    // onCancel is missing from the typings
    const response = await (0, prompts_1.default)(questions, { onCancel });
    if (isCancelled) {
        console.log('Cancelled, no change files are written');
    }
    else {
        return response;
    }
}
exports._promptForPackageChange = _promptForPackageChange;
/**
 * Validate/update the response from the user and return the full change file info.
 * @internal exported for testing
 */
function _getChangeFileInfoFromResponse(params) {
    const { pkg, email, options } = params;
    let response = params.response;
    // if type is absent in the user input, there are two possiblities for
    // proceeding next:
    // 1) if options.type is defined, use that
    // 2) otherwise, we hit the edge case when options.type is undefined
    //    and there was only one possible ChangeType to display, 'none'
    //    but we didn't display it due to showChangeTypePrompt === false;
    //    so set the type to 'none'
    if (!response.type) {
        if (!options.type) {
            console.log("WARN: change type 'none' assumed by default");
            console.log('(Not what you intended? Check the repo-level and package-level beachball configs.)');
        }
        response = { ...response, type: options.type || 'none' };
    }
    // fallback to the options.message if message is absent in the user input
    if (!response.comment && options.message) {
        response = { ...response, comment: options.message };
    }
    // prevent invalid change types from being entered via custom prompts
    if (!(0, isValidChangeType_1.isValidChangeType)(response.type)) {
        console.error(`Prompt response contains invalid change type "${response.type}"`);
        return;
    }
    return {
        ...response,
        packageName: pkg,
        email: email || 'email not defined',
        dependentChangeType: options.dependentChangeType || (response.type === 'none' ? 'none' : 'patch'),
    };
}
exports._getChangeFileInfoFromResponse = _getChangeFileInfoFromResponse;
//# sourceMappingURL=promptForChange.js.map