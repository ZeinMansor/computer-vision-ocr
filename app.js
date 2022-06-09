const path = require("path");

const Koa = require("koa");
const Router = require("@koa/router");
const multer = require("@koa/multer");

const app = new Koa();
const router = new Router();

const render = require("koa-ejs");

const extractText = require("./util/extract-text-javascript");
const pythonExtractText = require("./util/extract-text-python");

const serve = require('koa-static')

function checkEmpty(text) {
  return text != "";
}

app.use(serve(path.join(__dirname, '/public')))


render(app, {
  root: path.join(__dirname, "views"),
  layout: 'template',
  viewExt: "html",
  cache: false,
  debug: false,
});



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    var fileFormat = file.originalname.split(".");
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

// add a route for uploading single files
router.post("/upload", upload.single("image"), async (ctx) => {
  const path = ctx.request.file.path.toString().replaceAll('\\', '/');
  try {
    const result = await extractText(path);
    
    console.log(`Result ${result}`)

    const data = [];
    result.map((line) => {
      let l = line.toString().split("<");
      data.push(l.filter(checkEmpty));
      // console.log(l.filter(checkEmpty));
    });

    console.log(data)
    

    return ctx.render('main' ,{ title: "Passport" ,preview: data });
  
  } catch (error) {
    console.log(error)
  }
});


router.get("main", "/", async (ctx) => {
  return ctx.render('form-page', { title: "Welcome" })
});


router.post("/javascript-script", upload.single("image"), async (ctx) => {
  
  if (!ctx.request.file) {
    console.log("A file is needed")
    ctx.body = { err: "A file is needed" }
  }

  try {
    const result = await extractText(ctx.request.file.path);
    
    const array = result.split("\n");
    const filterd = array.filter(checkEmpty);

    const id = filterd.slice(-2);

    console.log(`Result ${id}`)

    const data = [];
    id.map((line) => {
      let l = line.toString().split("<");
      data.push(l.filter(checkEmpty));
    });

    console.log(data)
    

    return ctx.render('main-javascript' ,{ title: "Passport" ,preview: data, raw: result });
  
  } catch (error) {
    console.log(error)
  }
});



router.post("/python-script", upload.single("image"), async (ctx) => {

  const path = ctx.request.file.path.toString().replaceAll('\\', '/');

  console.log(path)

  await pythonExtractText(path)
    .then((results) => {
      console.log(results);

      const data = {
        nationality: results[2],

        firstName: results[15],
        lastName: results[16],
        fatherName: results[17],
        motherName: results[18],
        dateOfBirth: results[19],
        placeOfBirth: results[20],
        
        sex: results[21],
        
      }
    
      return ctx.render('main-python' ,{ title: "Passport" , data: data, raw: results });
    })
    .catch((err) => { console.log(err) })
});




router.get("/camera", async (ctx) => {
  return ctx.render('camera', { title: "Camera" });
})

router.post("/camera", upload.single("image"), async (ctx) => {
  
  console.log(ctx.file)
  console.log(ctx.request.file)
  const path = ctx.file.path.toString().replaceAll('\\', '/');

  await pythonExtractText(path)
    .then((results) => {
      console.log(results);

      // const data = {
      //   nationality: results[2],

      //   firstName: results[15],
      //   lastName: results[16],
      //   fatherName: results[17],
      //   motherName: results[18],
      //   dateOfBirth: results[19],
      //   placeOfBirth: results[20],
        
      //   sex: results[21],
        
      // }
    
      // return ctx.render('main-python' ,{ title: "Passport" , data: data, raw: results });
    })
    .catch((err) => { console.log(err) })

  return ctx.render('main-python', { title: "Processed Data" });
  
})


// add the router to our app
app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Connected on port ${port}`);
});


// [
//    0     'SYRIAN',
//    1     'J Typeltypee Country code�',
//    2     'P SYR',
//    3     'Issue no/N d�livrance:',
//    4     'Given Name/Pr�nom',
//    5     'Surname/Nom:',
//    6     'Father Name/Nom du p�re:',
//    7     'Mother Name/Nom de la m�re:',
//    8     'Birth Date/Date de naissance:',
//    9     'Birth Place/Lieu de naissance:',
//    10    'Sex/Sexe:',
//    11    'RAB REPUBLIC',
//    12    'REPUBLIQUE ARABE SYRIENNE',
//    13    'ce uy LN',
//    14    '008-20-1.014746',
//    15    'AHMAD',
//    16    'MANSOUR',
//    17    '.MHAMAD',
//    18    'SAMIHA',
//    19    '13/08/1991',
//    20    'TARTOUS',
//    21    'M',
//    22    'asl',
//    23    'Brey',
//    24    'de spell deyall ey gpa',
//    26    '�deel py',
//    27    'ial'
// ]