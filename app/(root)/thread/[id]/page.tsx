import ThreadCard from "@/components/cards/Thread-Card";
import Comment from "@/components/forms/Comment";
import { fetchThreadByID } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  const thread = await fetchThreadByID(params.id);
  // console.log(thread);
  
  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user.id || ""}
          parrentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
      <div className="mt-7">
        <Comment
          threadId={thread.id}
          currentUserImg={userInfo?.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10 flex flex-col gap-4">
        {thread.children.map((child:any) =>(
          <ThreadCard
          key={child._id}
          id={child._id}
          currentUserId={child?.id || ""}
          parrentId={child.parentId}
          content={child.text}
          author={child.author}
          community={child.community}
          createdAt={child.createdAt}
          comments={child.children}
          isComment
        />
        ))}
      </div>
    </section>
  );
};

export default page;
