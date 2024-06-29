import { Request, Response } from "express";
import CommentService from "../services/CommentService";
import jwt, { JwtPayload } from 'jsonwebtoken';
require('dotenv').config();
const jwttoken = process.env.jwt_Token_Validation;

interface DecodedToken extends JwtPayload {
    userId: string;
}

class CommentController {
    constructor() { }

    async insertComment(req: Request, res: Response) {
        const body = req.body;
        console.log(body)
        if (!body.content || !body.postId) {
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

                const newComment = await CommentService.insertComment({
                    content: body.content,
                    author: {
                        connect: { id: userId },
                    },
                    post: {
                        connect: { id: body.postId }
                    }
                });

                return res.json({  newComment: newComment });
            });
        } catch (error) {
            return res.json({  error: error });
        }
    }
    async getAllComment(req: Request, res: Response) {

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

                const comments = await CommentService.getComments();

                return res.json({  comments: comments });
            });
        } catch (error) {
            return res.json({  error: error });
        }
    }

    async getCommentbyUserId(req: Request, res: Response) {
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

                const comments = await CommentService.getCommentsByUserId(parseInt(id));

                return res.json({  comments: comments });
            });
        } catch (error) {
            return res.json({  error: error });
        }
    }
    async updateComment(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            return res.json({  error: "Faltou o ID" });
        }

        const body = req.body;

        if (!body.content) {
            return res.json({  error: "Falta parâmetros" });
        }

        try {
            const updatedComment = await CommentService.updateComment(
                {
                    content: body.content
                },
                parseInt(id)
            );
            return res.json({  updatedUser: updatedComment });
        }
        catch (error) {
            return res.json({  error: error });
        }
    }
    async deleteComment(req: Request, res: Response) {
        const id = req.params.id;
        if (!id) {
            return res.json({  error: "Faltou o ID" });
        }

        try {
            const response = await CommentService.deleteComment(parseInt(id));
            if (response) {
                return res.json({  message: "Comentário deletado com sucesso" });
            }
        } catch (error) {
            console.log(error);
            return res.json({  error: error });
        }
    }
}

export default new CommentController();