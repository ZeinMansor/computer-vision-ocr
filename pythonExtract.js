const PythonShell = require("python-shell").PythonShell;

const pythonExtractText = function (file) {
  return new  Promise((resolve, reject) => {
    
    var options = {
      args: [file],
    };
  
    PythonShell.run("./util/Untitled4.py", options, function (err, results) {
      if (err) {
        reject(err)
      } else {
        console.log(results);
        console.log("finished");

        resolve(results);
      }
    });
  })
};


module.exports = pythonExtractText