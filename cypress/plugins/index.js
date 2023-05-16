module.exports = (on, config) => {
    on('task', {
      readFile(filePath) {
        return new Promise((resolve, reject) => {
          fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      }
    });
  };