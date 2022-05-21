import KoaRouter from "koa-router";
import { upload } from "../util/multer.mjs";
const router = new KoaRouter();

router.post("/upload", upload.single('image'), ctx => {
    console.log('ctx.request.file', ctx.request.file);
    console.log('ctx.file', ctx.file);
    console.log('ctx.request.body', ctx.request.body);
    ctx.body = 'done';
})

export default router