"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface props {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({ text, author, communityId, path }: props) {
  connectToDB();
  try {
    const createThread = await Thread.create({
      text,
      author,
      community: null,
    });
    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread._id },
    });
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Thread is Not Created: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();
  const skipAmount = (pageNumber - 1) * pageSize;
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });
  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });
  const posts = await postsQuery.exec();
  const isNext = totalPostsCount > skipAmount + posts.length;
  return { posts, isNext };
}

export async function fetchThread(userId: string) {
  try {
    connectToDB();
    return await Thread.find({ author: userId });
  } catch (error: any) {
    throw new Error(`Threads are not fetched: ${error.message}`);
  }
}

export async function fetchThreadByID(id: string) {
  connectToDB();
  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      }).exec();
      // console.log("Getting thread By Id :",thread);
      
      return thread;
  } catch (error) {
    throw new Error("Not getting the Thread")
  }
}

export async function addCommentToThread(
threadId:string,
commentText:string,
userId:string,
path:string,
){
  connectToDB()
  try {
    const originalThread = await Thread.findById(threadId)
    if(!originalThread) {
      throw new Error('Thread not found')
    }
// console.log("Getting the original Thread for adding comment :",originalThread);

    const commentThread = new Thread({
      text:commentText,
      author:userId,
      parentId:threadId,
    })
    // console.log("Adding comment to final thread",commentThread);
    

    const saveCommentThread = await commentThread.save()
    originalThread.children.push(saveCommentThread._id)
    await originalThread.save()
    revalidatePath(path)

  } catch (error:any) {
    throw new Error(`Error adding comment to thread: ${error.message}`)
  }
}
