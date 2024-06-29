import { Request, Response } from "express";
import UserDataBaseService from "../services/UserDataBaseService";
import { generateHash } from "../utils/BcryptUtils";
import jwt, { JwtPayload } from 'jsonwebtoken';
require('dotenv').config();
const jwttoken = process.env.jwt_Token_Validation;

interface DecodedToken extends JwtPayload {
  userId: string;
}
class UserController {
  constructor() { }

  async listUsers(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.json({ error: 'Token não fornecido' });
      }

      if (!jwttoken) {
        return res.json({ error: 'Chave secreta não definida' });
      }

      jwt.verify(token, jwttoken, async (err, decodedToken) => {
        if (err) {
          return res.json({ error: 'Token inválido' });
        }

        const users = await UserDataBaseService.listDBUsers();
        return res.json({ users: users });
      });
    } catch (error) {
      console.log(error);
      return res.json({ error: error });
    }
  }

  async createUser(req: Request, res: Response) {
    const body = req.body;

    if (!body.email || !body.name || !body.password) {
      return res.json({ error: 'Falta parâmetros' });
    }

    const hashPassword = await generateHash(body.password);

    if (!hashPassword) {
      return res.json({ error: 'Erro ao criptografar senha ...' });
    }

    try {
      const newuser = await UserDataBaseService.insertDBUser({
        name: body.name,
        email: body.email,
        password: hashPassword as string
      });
      return res.json({ newuser: newuser });

    } catch (error) {
      return res.json({ error: error });
    }
  }

  async updateUser(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.json({ error: 'Faltou o ID' });
    }

    const { name, email } = req.body;
    console.log(req.body)
    if (!email || !name) {
      return res.json({ error: 'Falta parâmetros' });
    }

    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.json({ error: 'Token não fornecido' });
      }

      if (!jwttoken) {
        return res.status(500).json({ status: 500, error: 'Chave secreta não definida' });
      }

      jwt.verify(token, jwttoken, async (err, decodedToken) => {
        if (err) {
          return res.json({  error: 'Token inválido' });
        }
        const updatedUser = await UserDataBaseService.updateDBUser(
          {
            name: name,
            email: email,
          },
          parseInt(id)
        );
        return res.json({  updatedUser: updatedUser });
      });
    } catch (error) {
      return res.json({  error: error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.json({  error: 'Faltou o ID' });
    }

    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.json({  error: 'Token não fornecido' });
      }

      if (!jwttoken) {
        return res.status(500).json({ status: 500, error: 'Chave secreta não definida' });
      }

      jwt.verify(token, jwttoken, async (err, decodedToken) => {
        if (err) {
          return res.json({  error: 'Token inválido' });
        }
        const response = await UserDataBaseService.deleteDBUser(parseInt(id));
        if (response) {
          return res.json({  message: "Usuário deletado com sucesso" });
        }

      });
    } catch (error) {
      console.log(error);
      return res.json({  error: error });
    }
  }
}

export default new UserController();
