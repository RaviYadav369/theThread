import React from "react";
import { currentUser } from "@clerk/nextjs";
import { fetchActivity, fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await fetchActivity(userInfo._id);
  

  return (
    <section>
      <h1 className="head-text mb-10">Acitvity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image src={activity.author.image} alt="Profile photo" width={24} height={24} className="rounded-full object-contain" />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {activity.author.name}
                    </span>{' '}
                    replied to your Thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-gray-1">No Activity</p>
        )}
      </section>
    </section>
  );
};

export default page;
