import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AuthService {
    constructor() {

    }

    async signIn(userLogin: Prisma.UserWhereInput) {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    OR:[
                        {name: userLogin.name},
                        {email: userLogin.email}
                      ]
                }
            });
            
            return user;

        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async signOut() {

    }
}

export default new AuthService();