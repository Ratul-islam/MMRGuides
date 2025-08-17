import { Router } from "express";
import userRouter from "../modules/user/route.js";
import uploadRouter from "../modules/upload/route.js";
import guideRouter from "../modules/posts/route.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/guides",
    route: guideRouter,
  },
  {
    path: "/upload",
    route: uploadRouter,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;