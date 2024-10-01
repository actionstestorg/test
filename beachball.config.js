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
      console.log(defaultPrompt.description.onState.toString())
      return [
        defaultPrompt.description,
       defaultPrompt.changeType,
      //  check if version upgrade
      {
        type: 'select',
        name: 'versionUpgrade',
        message: 'Is this a version upgrade?',
        choices: [
          { title: 'No', value: 'no' },
          { title: 'Yes', value: 'yes' },
        ],
      
      },
      //if version upgrade, ask for version
      {
        type: (prev) => (prev === 'yes' ? 'text' : null),
        name: 'version',
        message: 'What version are you upgrading to?',
        initial: '1.0.0',
      },

      ];
    },
  },
};
