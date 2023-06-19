import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/types/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import filterUserForClient from "~/server/helper/filterUserForClient";
import { Comment, Post } from "@prisma/client";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const addUserDataToComment = async (comments: Comment[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: comments.map((comment) => comment.authorId),
      limit: 100,
    })
  ).map(filterUserForClient);

  return comments.map((comment) => {
    const author = users.find((user) => user.id === comment.authorId);
    if (!author || !author.name)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Author for comment not found",
      });

    return {
      comment,
      author,
    };
  });
};

export const commentsRouter = createTRPCRouter({
  getCommentsByPostId: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.prisma.comment
        .findMany({
          where: {
            postId: input.postId,
          },
          take: 100,
          orderBy: [
            {
              createdAt: "desc",
            },
          ],
        })
        .then(addUserDataToComment)
    ),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(280),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const comment = await ctx.prisma.comment.create({
        data: {
          authorId,
          content: input.content,
          postId: input.postId,
        },
      });

      return comment;
    }),
});
