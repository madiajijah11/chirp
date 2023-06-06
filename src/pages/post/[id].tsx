import Head from "next/head";
import { type NextPage } from "next";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="flex h-screen flex-col items-center bg-gradient-to-b from-blue-400 to-blue-600">
        <div>SinglePostPage</div>
      </main>
    </>
  );
};

export default SinglePostPage;
