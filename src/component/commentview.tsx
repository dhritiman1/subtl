import { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";

type CommentWithUser = RouterOutputs["comments"]["getCommentsByPostId"][number];
export default function CommentView(props: CommentWithUser) {
  const { comment, author } = props;
  return (
    <div className="flex w-full flex-row gap-3 overflow-hidden border-b border-zinc-800 px-4 py-3">
      {/* <Link href={`/@${author.name}`} className="w-10"> */}
      <Image
        className="flex h-10 w-10 rounded-full"
        src={author.profilePicture}
        alt="profile picture"
        width={40}
        height={40}
      />
      {/* </Link> */}

      <div className="w-full pr-2">
        <Link href={`/@${author.name}`}>
          <p>@{`${author.name}`}</p>
        </Link>
        <p className="w-full whitespace-normal break-words ">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
