import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { RouterOutputs, api } from "~/utils/api";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import PostView from "~/component/postview";

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
  return (
    <div className="w-full">
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const AppHome = () => {};

const Home: NextPage = () => {
  const user = useUser();

  api.posts.getAll.useQuery();

  if (!user.isLoaded) return <div />;

  return (
    <>
      <main className="flex min-h-screen flex-col items-center">
        <div className="h-full w-full border-x md:max-w-2xl">
          <div className="h-[65px] border-b px-2 py-3">
            {!user.isSignedIn && <SignInButton />}
            {user.isSignedIn && <CreatePostWizard />}
          </div>
          <div>
            <SignOutButton />
          </div>

          {user.isSignedIn ? <Feed /> : <div>not signed in</div>}
        </div>
      </main>
    </>
  );
};

export default Home;
