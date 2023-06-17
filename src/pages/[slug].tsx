import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import SuperJSON from "superjson";
import MainLayout from "~/component/layout";
import { appRouter } from "~/server/api/root";
import { api } from "~/utils/api";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>---</title>
      </Head>
      <MainLayout>
        <div className="flex flex-row items-center gap-5 px-5 py-12">
          <div className="rounded-full bg-[#ffffff23]">
            <Image
              src={data.profilePicture}
              alt={`${username}'s profile picture`}
              height={96}
              width={96}
              className="rounded-full shadow-md shadow-slate-800"
            />
          </div>

          <div>
            <div className="text-2xl font-light">{username}</div>
            <div className="font-normal text-zinc-400">user bio</div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

import { createServerSideHelpers } from "@trpc/react-query/server";
import { prisma } from "~/server/db";
import Image from "next/image";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: SuperJSON, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: { trpcState: ssg.dehydrate(), username },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
