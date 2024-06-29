import { Router } from "express";
import PostController from "../controllers/PostController";

const PostRouter = Router();

PostRouter.post("/api/post/create", PostController.insertPost);

PostRouter.post("/api/post/getallpost", PostController.getAllPost);

PostRouter.get("/api/post/getPostByUserId/:id", PostController.getPostbyUserId);

PostRouter.patch("/api/post/update/:id", PostController.updatePost);

PostRouter.delete("/api/post/delete/:id", PostController.deletePost);

export default PostRouter;
