import Image from "next/image";
import Head from "next/head";
import MainLayout from "~/component/layout";
import PostView from "~/component/postview";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { GetStaticProps, NextPage } from "next";

const PostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.posts.getPostById.useQuery({ id });
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.author.name}'s post`}</title>
      </Head>
      <MainLayout user={true}>
        <div className="h-screen w-full border-zinc-800 ">
          <div className="flex h-[65px] items-center border-b border-zinc-800">
            <p className="px-4 text-xl font-light">post:</p>
          </div>
          <PostView {...data} />
          <div className="px-4 py-3">TODO: comments</div>
        </div>
      </MainLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.posts.getPostById.prefetch({ id });

  return {
    props: { trpcState: ssg.dehydrate(), id },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default PostPage;
