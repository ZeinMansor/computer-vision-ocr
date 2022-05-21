const tesseract = require('tesseract.js')

const worker = tesseract.createWorker({
    logger: (m) => console.log(m),
  });
  
  function checkEmpty(text) {
    return text != "";
  }



function extractText(file) {
    return new Promise(async (resolve, reject) => {
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const {
        data: { text },
      } = await worker.recognize(file);
  
      const array = text.split("\n");
      const filterd = array.filter(checkEmpty);
  
      //   console.log(filterd);
  
      const id = filterd.slice(-2);
  
      //     console.log(id);
  
      resolve(id)
      // await worker.terminate();
    });
  }

module.exports = extractText;