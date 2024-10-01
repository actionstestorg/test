const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questions = [
  'What is the new version? ',
  'Is this a major, minor, or patch update? '
];

let answers = [];

module.exports =  askQuestion = (index) => {
  if (index === questions.length) {
    console.log('Version:', answers[0]);
    console.log('Update type:', answers[1]);
    rl.close();
    process.exit(0);
  } else {
    console.log(questions[index]);
    rl.question(questions[index], (answer) => {
      answers.push(answer);
      askQuestion(index + 1);
    });
  }
};

askQuestion(0);