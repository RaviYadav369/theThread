import ThreadCard from "@/components/cards/Thread-Card";
import { fetchPosts, fetchThread } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;
  const result = await fetchPosts(1, 30);

  return (
    <>
      <h1 className="head-text ">Hello there</h1>
      <section className="mt-10 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No thread found</p>
        ) : (
          <>
          {result.posts.map((post) =>(
            <ThreadCard 
            key={post._id}
            id={post._id}
            currentUserId={user?.id}
            parrentId={post.parentId}
            content={post.text}
            author={post.author}
            community={post.community}
            createdAt ={post.createdAt}
            comments={post.children}
            isComment
            />
          ))}
          </>
        )}
      </section>
    </>
  );
}
