import Image from "next/image";
import PostView from "~/component/postview";
import Head from "next/head";
import MainLayout from "~/component/layout";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { GetStaticProps, NextPage } from "next";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostByUserId.useQuery({
    userId: props.userId,
  });
  if (isLoading) return <div>Loading...</div>;
  if (!data || data.length === 0) return <div>empty...</div>;

  return (
    <div>
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

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
            <div className="font-normal text-zinc-400">TODO: user bio</div>
          </div>
        </div>
        <ProfileFeed userId={data.id} />
      </MainLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

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
