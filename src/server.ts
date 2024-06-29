import express from "express";
import AuthRouter from "./routes/AuthRoutes";
import UserRouter from "./routes/UserRoutes";
import PostRouter from "./routes/PostRoutes";
import CommentRouter from "./routes/CommentRoutes"
import  routes  from "./routes/index";

const port = 3000

const app = express();
app.use(express.json());

app.use(routes);

app.listen(port, function () {
  console.log("Servidor rodando na porta " + port);
});
