"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bump_1 = require("./commands/bump");
const canary_1 = require("./commands/canary");
const change_1 = require("./commands/change");
const init_1 = require("./commands/init");
const publish_1 = require("./commands/publish");
const sync_1 = require("./commands/sync");
const help_1 = require("./help");
const getOptions_1 = require("./options/getOptions");
const validate_1 = require("./validation/validate");
(async () => {
    const options = (0, getOptions_1.getOptions)(process.argv);
    if (options.help) {
        (0, help_1.showHelp)();
        process.exit(0);
    }
    if (options.version) {
        (0, help_1.showVersion)();
        process.exit(0);
    }
    // Run the commands
    switch (options.command) {
        case 'check':
            (0, validate_1.validate)(options);
            console.log('No change files are needed');
            break;
        case 'publish':
            (0, validate_1.validate)(options, { allowFetching: false });
            // set a default publish message
            options.message = options.message || 'applying package updates';
            await (0, publish_1.publish)(options);
            break;
        case 'bump':
            (0, validate_1.validate)(options);
            await (0, bump_1.bump)(options);
            break;
        case 'canary':
            (0, validate_1.validate)(options, { allowFetching: false });
            await (0, canary_1.canary)(options);
            break;
        case 'init':
            await (0, init_1.init)(options);
            break;
        case 'sync':
            await (0, sync_1.sync)(options);
            break;
        case 'change':
            const { isChangeNeeded } = (0, validate_1.validate)(options, { allowMissingChangeFiles: true });
            if (!isChangeNeeded && !options.package) {
                console.log('No change files are needed');
                return;
            }
            await (0, change_1.change)(options);
            break;
        default:
            throw new Error('Invalid command: ' + options.command);
    }
})().catch(e => {
    (0, help_1.showVersion)();
    console.error('An error has been detected while running beachball!');
    console.error(e?.stack || e);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map