import Head from "next/head";
import { type NextPage } from "next";

const ProfilePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="flex h-screen flex-col items-center bg-gradient-to-b from-blue-400 to-blue-600">
        <div>ProfilePage</div>
      </main>
    </>
  );
};

export default ProfilePage;
