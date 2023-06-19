import Image from "next/image";
import Head from "next/head";
import MainLayout from "~/component/layout";
import PostView from "~/component/postview";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { GetStaticProps, NextPage } from "next";
import { Loading } from "~/component/loading";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

const CommentWizard = ({ id }: { id: string }) => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.comments.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.comments.getCommentsByPostId.invalidate();
    },
  });

  if (!user) return null;
  return (
    <div className="flex gap-3 px-4">
      <Image
        className="flex h-10 w-10 rounded-full"
        src={user.profileImageUrl}
        alt="profile image"
        width={40}
        height={40}
      />
      <input
        type="text"
        value={input}
        className="w-full bg-transparent focus:outline-none"
        placeholder="write something!"
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            mutate({ content: input, postId: id });
          }
        }}
      />
      {input !== "" && !isPosting && (
        <button
          onClick={() => {
            mutate({ content: input, postId: id });
          }}
          className="px-2"
        >
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex w-[30px] items-center justify-center">···</div>
      )}
    </div>
  );
};

const CommentList = ({ postId }: { postId: string }) => {
  const { data, isLoading: commentsLoading } =
    api.comments.getCommentsByPostId.useQuery({ postId });
  if (commentsLoading) return <Loading height={64} width={64} />;
  if (!data)
    return (
      <div className="flex w-full items-center justify-center border-b border-zinc-800 px-4 py-3">
        <p className="font-light text-zinc-500">
          no comments yet. be the first to make one.
        </p>
      </div>
    );

  return (
    <div className="flex w-full flex-row flex-wrap">
      {data?.map((fullPost) => (
        <div key={fullPost.comment.id}> {fullPost.comment.content} </div>
      ))}
    </div>
  );
};

const PostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.posts.getPostById.useQuery({ id });
  if (isLoading) return <Loading height={64} width={64} />;
  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.author.name}'s post`}</title>
      </Head>
      <MainLayout user={true}>
        <div className="h-screen w-full border-zinc-800 ">
          <div className="flex h-[65px] items-center border-b border-zinc-800">
            <p className="px-4 text-xl font-light">post</p>
          </div>
          <PostView {...data} />
          <div className="border-b border-zinc-800 px-4 py-3">
            TODO: comments
          </div>
          <div className="border-b border-zinc-800 py-3">
            <CommentWizard id={id} />
          </div>
          {/* <CommentList postId={id} /> */}
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
