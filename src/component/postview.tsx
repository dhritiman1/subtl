import { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export default function PostView(props: PostWithUser) {
  const { post, author } = props;
  return (
    <div className="flex w-full flex-row gap-3 border-b border-zinc-800 px-2 py-3">
      <Image
        className="flex h-10 w-10 rounded-full"
        src={author.profilePicture}
        alt="profile picture"
        width={40}
        height={40}
      />
      <div className="w-full">
        <Link href={`/@${author.name}`}>
          <p>@{`${author.name}`}</p>
        </Link>
        <Link href={`/post/${post.id}`} className="w-full">
          <p>{post.content}</p>
        </Link>
      </div>
    </div>
  );
}
