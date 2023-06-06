import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex items-start gap-2">
      <Image
        className="h-10 w-10 rounded-full border border-gray-300 object-center"
        src={author.profileImageUrl}
        alt="Profile"
        width={40}
        height={40}
      />
      <div className="flex w-full flex-col">
        <div className="flex items-center">
          <Link href={`/@${author.username}`}>
            <span className="font-bold">{`@${author.username}`}</span>
          </Link>
          <span className="ml-2 text-gray-500">
            {dayjs(post.createdAt).fromNow()}
          </span>
        </div>
        <Link href={`/post/${post.id}`}>
          <p className="text-sm">{post.content}</p>
        </Link>
        <div className="mt-2 flex gap-2">
          <button className="text-blue-500 hover:text-blue-700">Like</button>
          <button className="text-gray-500 hover:text-gray-700">Retweet</button>
        </div>
      </div>
    </div>
  );
};
