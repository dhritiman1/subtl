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
      <MainLayout>
        <PostView {...data} />
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
