import { Request, Response } from "express";
import PostService from "../services/PostService";
import jwt, { JwtPayload } from 'jsonwebtoken'; 
require('dotenv').config();
const jwttoken = process.env.jwt_Token_Validation;

interface DecodedToken extends JwtPayload {
    userId: string;
}

class PostController {
    constructor() { }

    async insertPost(req: Request, res: Response) {
        const body = req.body;

        if (!body.post.title || !body.post.content) {
            return res.json({  error: 'Falta parâmetros' });
        }

        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.json({  error: 'Token não fornecido' });
            }

            if (!jwttoken) {
                return res.json({  error: 'Chave secreta não definida' });
            }

            jwt.verify(token, jwttoken, async (err, decodedToken) => {
                if (err) {
                    return res.json({  error: 'Token inválido' });
                }

                const decoded = decodedToken as DecodedToken;

                const userId = parseInt(decoded.userId, 10);

                const newPost = await PostService.insertPost({
                    title: body.post.title,
                    content: body.post.content,
                    author: {
                        connect: { id: userId },
                    },
                    published: false,
                });

                return res.json({  newPost: newPost });
            });
        } catch (error) {
            return res.json({  error: error });
        }
    }
    async getAllPost(req: Request, res: Response) {

        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.json({  error: 'Token não fornecido' });
            }

            if (!jwttoken) {
                return res.json({  error: 'Chave secreta não definida' });
            }

            jwt.verify(token, jwttoken, async (err, decodedToken) => {
                if (err) {
                    return res.json({  error: 'Token inválido' });
                }

                const posts = await PostService.getPosts();

                return res.json({  posts: posts });
            });
        } catch (error) {
            return res.json({  error: error });
        }
    }

    async getPostbyUserId(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.json({  error: 'Token não fornecido' });
            }

            if (!jwttoken) {
                return res.json({  error: 'Chave secreta não definida' });
            }

            jwt.verify(token, jwttoken, async (err, decodedToken) => {
                if (err) {
                    return res.json({  error: 'Token inválido' });
                }

                const posts = await PostService.getPostsByUserId(parseInt(id));

                return res.json({  posts: posts });
            });
        } catch (error) {
            return res.json({  error: error });
        }
    }
    async updatePost(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            return res.json({  error: "Faltou o ID" });
        }

        const body = req.body;

        if (!body.content || !body.title) {
            return res.json({  error: "Falta parâmetros" });
        }

        try {
            const updatedPost = await PostService.updatePost(
                {
                    content: body.content,
                    title: body.title,
                },
                parseInt(id)
            );

            return res.json({  updatedPost: updatedPost });
        }
         catch (error) {
            return res.json({  error: error });
        }
    }
    async deletePost(req: Request, res: Response){
        const id = req.params.id;
        if (!id) {
            return res.json({  error: "Faltou o ID" });
        }
    
        try {
          const response = await PostService.deletePost(parseInt(id));
          if (response) {
            return res.json({  message: "Post deletado com sucesso" });
          }
        } catch (error) {
          console.log(error);
          return res.json({  error: error });
        }
    }
}

export default new PostController();