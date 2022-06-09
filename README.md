# **Optical Character Recognition /OCR/**


### Here we used two different OCR libraries to extract text from jpg image, here we will explain the code and result 


## **Tools** :
* [Koa](https://koajs.com/) : intuative web server built on Express.js
* [Multer](https://www.npmjs.com/package/multer) : nodejs package to recive multipart files
* [python-shell](https://www.npmjs.com/package/python-shell) : A simple way to run Python scripts from Node.js



### 1 -  Javascript:
- in javascritp we used a library called [tesseract.js](https://www.npmjs.com/package/tesseract.js/v/2.1.1) running on nodejs server, Tesseract.js wraps an emscripten port of the Tesseract OCR Engine. It works in the browser using webpack or plain script tags with a CDN and on the server with Node.js. After you install it, using it is as simple as:


1- first we create a worker instance from tesseract package

```javascript
import Tesseract from 'tesseract.js';

const worker = tesseract.createWorker({
    logger: (m) => console.log(m),
  });
  
  function checkEmpty(text) {
    return text != "";
}
```

2 - second we created a promise that awaits to the end of the  extracting process and returns the result, the function takes a variable `file` which is the path to the image
 and we set the language to `English`
```javascript
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
    
      const id = filterd.slice(-2);
    
      resolve(text)
    });
}
```

3 - we open an endpoint to accept the file in `POST` request,

the route will call the function `extractText` and render a view with the curresponding data

```javascript
router.post("/javascript-script", upload.single("image"), async (ctx) => {
  
  if (!ctx.request.file) {
    console.log("A file is needed")
    ctx.body = { err: "A file is needed" }
  }

  try {
    const result = await extractText(ctx.request.file.path);
    // string manipulation to extract the needed data    
    const array = result.split("\n");
    const filterd = array.filter(checkEmpty);

    const id = filterd.slice(-2);

    const data = [];
    id.map((line) => {
      let l = line.toString().split("<");
      data.push(l.filter(checkEmpty));
    });

    return ctx.render('main' ,{ title: "Passport" ,preview: data, raw: result });
  
  } catch (error) {
    console.log(error)
  }
});
```






### 2 - Python:
- we use the node.js server to run a python script using `python-shell` that extracts the text from the image, 
- we pass the image path to the script from `sys.argv[1]`, the first argument when running the script in the terminal

1 - the python script
```python
from PIL import Image
from pytesseract import pytesseract
import sys

# specify tesseract ocr .exe installation path
path_to_tesseract = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

image_path = sys.argv[1];

# Opening the image & storing it in an image object
img = Image.open(image_path)
  
pytesseract.tesseract_cmd = path_to_tesseract
  
text = pytesseract.image_to_string(img)
  
# Displaying the extracted text
print(text[:-1])
```

2 - we created a function that uses the same method, a promise that returns the result of the python script, the function takes a path to the image `file`

```javascript
const PythonShell = require("python-shell").PythonShell;

const pythonExtractText = function (file) {
  return new  Promise((resolve, reject) => {
    
    var options = {
      args: [file], // pass the image to the python script
    };
  
    PythonShell.run("./util/ocrScript.py", options, function (err, results) {
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
```

3 - Open an endpoint to recive the image

```javascript
router.post("/python-script", upload.single("image"), async (ctx) => {

  // change the path to be unix based not windows based
  const path = ctx.request.file.path.toString().replaceAll('\\', '/');

  console.log(path)

  await pythonExtractText(path)
    .then((results) => {
      console.log(results);
      // Extract the wanted data from the array
      const data = {
        lastName: results[1],
        firstName: results[3],
        dateOfBirth: results[5],
        placeOfBirth: results[7],
        dateOfIssue: results[9],
        dateOfExpire: results[11],
        passportId: results[13],
        height: results[15],
        sex: results[17],
        signature: results[19]
      }
    
      return ctx.render('main-python' ,{ title: "Passport" , array: data, raw: results });
    })
    .catch((err) => { console.log(err) })
});
```



### BY : 
 * Zein Mansor, AbdAlrazzaq Alnouri, Ghaith Almasri


