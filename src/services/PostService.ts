import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PostService {
    constructor() { }

    async insertPost(post: Prisma.PostCreateInput) {
        try {
            const newpost = await prisma.post.create({
                data: post
            });
            return newpost;

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async updatePost(post: Prisma.PostUpdateInput, id: number) {
        try {
            const updatedPost = await prisma.post.update({
                data: post,
                where: {
                    id: id,
                },
            });
            return updatedPost;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async getPosts() {
        try {
            const posts = await prisma.post.findMany({
                include: {
                    author: true,
                    comments: true
                }
            });
            return posts;

        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async getPostsByUserId(id: number) {
        try {
            const userPosts = await prisma.post.findMany({
                include: {
                    author: true,
                    comments: true
                },
                where: {
                    author: { id: id }
                }
            });

            return userPosts;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async deletePost(id: number) {
        try {
            await prisma.comment.deleteMany({
                where: {
                    postId: id,
                },
            });
            await prisma.post.delete({
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
export default new PostService();