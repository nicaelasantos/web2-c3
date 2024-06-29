import { Router } from "express";

import  AuthRouter  from "./AuthRoutes"
import  UserRouter  from "./UserRoutes"
import  PostRouter  from "./PostRoutes"
import  CommentRouter  from "./CommentRoutes"

const routes = Router();


routes.use(UserRouter)
routes.use(AuthRouter)
routes.use(PostRouter)
routes.use(CommentRouter)

export default routes 
