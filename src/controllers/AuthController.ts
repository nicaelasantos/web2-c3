import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import AuthService from "../services/AuthService";
import { validateHash } from "../utils/BcryptUtils";
require('dotenv').config();
const jwttoken = process.env.jwt_Token_Validation;

class AuthController {
    constructor() { }

    async signIn(req: Request, res: Response) {
        const body = req.body;

        if (!body.email || !body.password) {
           return res.json({ error: 'Falta parâmetros' });
        }

        try {
            const user = await AuthService.signIn({
                email: body.email,
                name: body.name,
            });

            if (!user) {
                return res.json({ error: 'Usuário não encontrado' });
            }

            const isPasswordValid = await validateHash(body.password, user.password);
            
            if (!isPasswordValid) {
                return res.json({ error: 'Senha incorreta' });
            }
            if (!jwttoken) {
                return res.json({status: 500, error: 'Chave secreta não definida' });
            }
            const token = jwt.sign({ userId: user.id }, jwttoken, {
                expiresIn: '1h',
            });

            return res.json({ status: "Usuário authenticado" });
        } catch (error) {
            return res.json({status: "error"});
        }
    }

}
export default new AuthController();
