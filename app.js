const Koa = require("koa");
const Router = require("@koa/router");
const multer = require("@koa/multer");
const app = new Koa();
const router = new Router();
const path = require("path");
const render = require("koa-ejs");
const extractText = require("./util/extract-text");
const pythonExtractText = require("./pythonExtract");

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
  
  try {
    const result = await extractText("./public/uploads/benpassport2.jpg");
    
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



router.post("/python-script", upload.single("image"), async (ctx) => {

  // console.log(ctx.request.file)

  const path = ctx.request.file.path.toString().replaceAll('\\', '/');

  console.log(path)

  await pythonExtractText(path)
    .then((results) => {
      console.log(results);
      ctx.body = { result: results}
    })
    .catch((err) => { console.log(err) })
});




router.get("/camera", async (ctx) => {
  return ctx.render('camera', { title: "Camera" });
})

router.post("/camera", upload.single("image"), async (ctx) => {
  console.log(ctx.request)
  // return ctx.render('camera', { title: "Camera" });
  return ctx.body = { file: ctx.request.file }
})


// add the router to our app
app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Connected on port ${port}`);
});
