import { Router } from "express";
import userRouter from "../modules/user/route.js";
import postRouter from "../modules/posts/route.js";
import uploadRouter from "../modules/upload/route.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/posts",
    route: postRouter,
  },
  {
    path: "/upload",
    route: uploadRouter,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;