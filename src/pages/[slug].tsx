import Head from "next/head";
import type { GetStaticProps, GetStaticPropsContext, NextPage } from "next";
import { PostView } from "~/components/PostView";
import { Layout } from "~/components/Layouts";
import Image from "next/image";
import Loading from "~/components/Loading";
import { generateSSGHelper } from "../server/helpers/ssgHelper";
import { api } from "~/utils/api";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-300 bg-white p-4 text-gray-500 shadow-lg">
        <Loading />
      </div>
    );

  if (!data)
    return <div className="bg-white text-gray-500">User has no posts yet.</div>;

  return (
    <div className="flex flex-col">
      {data?.map((posts) => (
        <div
          key={posts.post.id}
          className="mb-4 rounded-lg bg-white p-4 shadow-lg"
        >
          <PostView {...posts} />
        </div>
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <Layout>
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
          <div className="relative">
            <Image
              src={data.profileImageUrl}
              alt={`${data.username ?? ""} profile picture`}
              className="h-32 w-32 rounded-full border border-gray-300 object-cover object-center"
              width={128}
              height={128}
            />
          </div>
          <div className="mt-4 text-xl font-bold">{data.username}</div>
          <div className="text-gray-500">@{data.username}</div>
        </div>
        <div className="mt-4">
          <ProfileFeed userId={data.id} />
        </div>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("slug is not a string");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
