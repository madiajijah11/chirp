import Head from "next/head";
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { type NextPage } from "next";
import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import Loading from "~/components/Loading";
import Link from "next/link";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (error) => {
      // console.log(error.data?.zodError?.fieldErrors?.content);
      const errorMessage = error.data?.zodError?.fieldErrors?.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post!, please try again later.");
      }
    },
  });

  const [input, setInput] = useState("");

  if (!user) return null;

  return (
    <div className="flex items-start gap-2">
      <Image
        className="h-10 w-10 rounded-full"
        src={user.profileImageUrl}
        alt="Profile"
        width={40}
        height={40}
      />
      <div className="flex w-full flex-col gap-2">
        <textarea
          className="w-full resize-none rounded-lg border-2 border-gray-300 bg-white px-5 py-3 text-sm focus:outline-none"
          placeholder="What's happening?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPosting}
        />
        <div className="flex justify-end">
          {input !== "" && !isPosting && (
            <button
              className="rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
              onClick={() => mutate({ content: input })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (input !== "") {
                    mutate({ content: input });
                  }
                }
              }}
            >
              Tweet
            </button>
          )}
          {isPosting && <div className="ml-2">Posting...</div>}
        </div>
      </div>
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex items-start gap-2">
      <Image
        className="h-10 w-10 rounded-full"
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

const Home: NextPage = () => {
  const user = useUser();

  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <Loading />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <main className="flex h-screen flex-col items-center bg-gradient-to-b from-blue-400 to-blue-600">
        <div className="w-full max-w-md">
          <div className="hidden rounded-lg bg-white p-4 shadow-lg">
            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          </div>
          <div className="mt-4">
            {!user.isSignedIn && (
              <div className="rounded-lg bg-white p-4 shadow-lg">
                <SignInButton />
              </div>
            )}
            {user.isSignedIn && (
              <div className="flex flex-col">
                <div className="mb-4 w-full rounded-lg bg-white p-4 shadow-lg">
                  <SignOutButton />
                </div>
                <div className="w-full rounded-lg bg-white p-4 shadow-lg">
                  <CreatePostWizard />
                </div>
              </div>
            )}
          </div>
          <div className="mt-4">
            {data?.map((fullPost) => (
              <div
                className="mb-4 rounded-lg bg-white p-4 shadow-lg"
                key={fullPost.post.id}
              >
                <PostView {...fullPost} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
