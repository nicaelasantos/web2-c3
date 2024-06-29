import { Router } from "express";
import CommentController from "../controllers/CommentController";

const CommentRouter = Router();

CommentRouter.post("/api/comment/create", CommentController.insertComment);

CommentRouter.post("/api/comment/getallcomment", CommentController.getAllComment);

CommentRouter.get("/api/comment/getcommentByUserId/:id", CommentController.getCommentbyUserId);

CommentRouter.patch("/api/comment/update/:id", CommentController.updateComment);

CommentRouter.delete("/api/comment/delete/:id", CommentController.deleteComment);

export default CommentRouter;