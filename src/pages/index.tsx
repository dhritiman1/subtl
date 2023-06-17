import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  UserProfile,
  useUser,
} from "@clerk/nextjs";
import { type NextPage } from "next";
import { RouterOutputs, api } from "~/utils/api";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import PostView from "~/component/postview";
import MainLayout from "~/component/layout";

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
  });

  if (!user) return null;
  return (
    <div className="flex gap-3">
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
            mutate({ content: input });
          }
        }}
      />
      {input !== "" && !isPosting && (
        <button
          onClick={() => {
            mutate({ content: input });
          }}
          className="px-2"
        >
          Post
        </button>
      )}
      {isPosting && <div className="px-2">...</div>}
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  if (postsLoading) return <div>Loading...</div>;
  if (!data) return <div>ded...</div>;
  return (
    <div className="flex w-full flex-row flex-wrap">
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();

  //api.posts.getAll.useQuery();

  if (!user.isLoaded) return <div />;

  return (
    <>
      <MainLayout>
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <div className="text-2xl font-light">title</div>
          <div>
            {!user.isSignedIn ? (
              <div className="flex gap-3">
                <SignInButton /> <p className="text-zinc-400">or</p>{" "}
                <SignUpButton />
              </div>
            ) : (
              <UserButton />
            )}
          </div>
        </div>
        {/* <SignOutButton /> */}
        {user.isSignedIn && (
          <div className="h-[65px] border-b border-zinc-800 px-2 py-3">
            <CreatePostWizard />
          </div>
        )}
        {user.isSignedIn ? (
          <Feed />
        ) : (
          <div className="relative">
            <div className=" z-50 flex h-[calc(100vh-57px)] w-[672px] items-center justify-center p-12 text-center">
              <p className="mb-32 text-xl font-light text-zinc-300">
                experience the power of simplicity and meaningful connections.
                join our community by{" "}
                <span className="text-white underline">
                  <Link href={"/sign-up"}>signing up</Link>
                </span>{" "}
                and discover a world where less is more.
              </p>
            </div>
          </div>
        )}
      </MainLayout>
    </>
  );
};

export default Home;
