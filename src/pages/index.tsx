import Head from "next/head";
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { type NextPage } from "next";
import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import { useState } from "react";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
  });

  const [input, setInput] = useState("");

  if (!user) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Image
        className="h-16 w-16 rounded-full sm:h-20 sm:w-20"
        src={user.profileImageUrl}
        alt="Profile"
        width={40}
        height={40}
      />
      <input
        className="h-10 rounded-lg border-2 border-gray-300 bg-white px-5 pr-16 text-sm focus:outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />
      <button
        className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={() => mutate({ content: input })}
      >
        Post
      </button>
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="card mb-4">
      <div className="card-body p-4">
        <div className="flex items-center">
          <Image
            className="mr-2 h-10 w-10 rounded-full"
            src={author.profileImageUrl}
            alt="Profile"
            width={40}
            height={40}
          />
          <div className="flex flex-col">
            <div className="flex">
              <span className="font-bold">{`@${author.username}`}</span>
              <span>{` · ${dayjs(post.createdAt).fromNow()}`}</span>
            </div>
            <p className="card-text">{post.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();

  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>Chirp</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center bg-gradient-to-b">
        <div className="w-full max-w-md">
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          <div className="mt-4">
            {!user.isSignedIn && <SignInButton />}
            {user.isSignedIn && (
              <div className="flex justify-between">
                <CreatePostWizard />
                <SignOutButton />
              </div>
            )}
          </div>
          <div className="mt-4">
            {data?.map((fullPost) => (
              <PostView key={fullPost.post.id} {...fullPost} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
