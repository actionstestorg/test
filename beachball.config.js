const prompts = require('prompts');
const { execSync } = require('child_process');

function getPreviousCommitMessages() {
  const logOutput = execSync('git log --pretty=format:%s -n 10').toString();
  // console.log(logOutput.split('\n'))
  const messages = logOutput.split('\n');
  return messages.map((message) => {
    return { title: message, value: message };
  });
}

const previousCommitMessages = getPreviousCommitMessages();


module.exports = {
  hooks: {
    postchange: () => {
      console.log('Running postchange hook...');
      execSync('node updateChangelog.js', { stdio: 'inherit' });
    },
  },
  changeFilePrompt: {
    changePrompt: (defaultPrompt, pkg) => {
      console.log(defaultPrompt.description.onState.toString());
      console.log(defaultPrompt.description.onState.toString());
      return [
        defaultPrompt.changeType,
        defaultPrompt.changeType,
        defaultPrompt.description,
        {
          type: 'select',
          name: 'isStudioVersionUpgrade',
          message: 'Is this a studio version upgrade?',
          choices: [
            { title: 'No', value: 'false' },
            { title: 'Yes', value: 'true' },
          ],
        
        },
        //if version upgrade, ask for version
        {
          type: (prev) => (prev === 'yes' ? 'text' : null),
          name: 'targetStudioVersion',
          message: 'Which version of Studio was used to test these changes?',
        },

      ];
    }
    }
  },
};
