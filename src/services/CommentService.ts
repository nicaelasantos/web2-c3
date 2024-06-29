import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class CommentService {
    constructor() { }

    async insertComment(comment: Prisma.CommentCreateInput) {
        try {
            const newComment = await prisma.comment.create({
                data: comment
            });
            return newComment;

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async updateComment(comment: Prisma.CommentUpdateInput, id: number) {
        try {
            const updatedComment = await prisma.comment.update({
                data: comment,
                where: {
                    id: id,
                },
            });
            return updatedComment;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async getComments() {
        try {
            const comments = await prisma.comment.findMany({
                include: {
                    author: true,
                    post: true
                }
            });

            return comments;

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async getCommentsByUserId(id: number) {
        try {
            const userComments = await prisma.comment.findMany({
                include: {
                    author: true,
                    post: true
                },
                where: {
                    author: { id: id }
                }
            });

            return userComments;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async deleteComment(id: number) {
        try {
            await prisma.comment.delete({
                where: {
                    id: id,
                },
            });
            return true;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}


export default new CommentService();