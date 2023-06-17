import { createServerSideHelpers } from "@trpc/react-query/server";
import { prisma } from "~/server/db";
import SuperJSON from "superjson";
import { appRouter } from "~/server/api/root";

export const generateSSGHelper = () => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: SuperJSON, // optional - adds superjson serialization
  });
  return ssg;
};
