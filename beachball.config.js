module.exports = {
    hooks: {
      prepublish: () => {
        console.log('Running prepublish hook...');
        // Add your custom prepublish logic here
      },
      postpublish: () => {
        console.log('Running postpublish hook...');
        // Add your custom postpublish logic here
      }
    }
  };
  