"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CreateStoryParams,
  CreateStoryResponse,
  CreateUserParams,
  CreateUserResponse,
  GenerateImageResponse,
  GetLoggedInUserDataResponse,
  SignInParams,
  SignInResponse,
} from "@/types";
import dbConnect from "./db";
import User from "@/models/user.model";
import { cookies } from "next/headers";
import Story from "@/models/story.model";
import serverClient from "./serverClient";
import { revalidatePath } from "next/cache";
import Preferences from "@/models/preferences.model";

// Create new user.
export async function createUser({
  email,
  name,
  password,
}: CreateUserParams): Promise<CreateUserResponse | null> {
  try {
    await dbConnect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return { message: "A user with this email already exists", status: 409 };
    }

    await User.create({ email, name, password });

    return { message: "User created succesfully.", status: 201 };
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function signIn({
  email,
  password,
}: SignInParams): Promise<SignInResponse | null> {
  try {
    await dbConnect();

    const existingUser = await User.findOne({ email, password });
    if (existingUser) {
      // Set token cookies.
      cookies().set("authToken", "true", {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day.
      });

      // Save user's email.
      cookies().set("userEmail", email, {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day.
      });

      return { message: "Signed in successfully.", status: 200 };
    }

    return { message: "Wrong credentials", status: 400 };
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function signOut(): Promise<void> {
  try {
    cookies().delete("userEmail");
    cookies().delete("authToken");
  } catch (err) {
    console.log(err);
  }
}

/*** GENERATE IMAGES ***/
export async function generateImages(): Promise<GenerateImageResponse | null> {
  try {
    const res = await serverClient.get("/generate-images");

    if (res.status === 500) {
      return {
        question: "Limit exceeded, try again later please.",
        images: [],
      };
    }

    return { question: res.data.question, images: res.data.images };
  } catch (err) {
    console.log(err);
    return null;
  }
}

/*** CREATE NEW STORY ***/
export async function createStory({
  author,
  storyTitle,
  story,
  imgUrl,
  imgTitle,
  answer1,
  answer2,
}: CreateStoryParams): Promise<CreateStoryResponse> {
  try {
    await dbConnect();

    if (!author || !story || !imgUrl) {
      return {
        message: "Author, story, and imgUrl are required.",
        status: 400,
      };
    }

    const user = await User.findOne({ email: author });
    if (!user) {
      return { message: "User not found.", status: 404 };
    }

    const newStory = await Story.create({
      author: user._id,
      story,
      storyTitle,
      imgUrl: imgUrl,
    });

    // Save story to user's stories.
    await User.findOneAndUpdate(
      { email: author },
      {
        $push: { stories: newStory._id },
        $inc: { rank: 2 },
      },
    );

    // Create new preference for user if doesn't exist.
    const existPreferences = await Preferences.findOne({ author: user._id });

    if (answer1 && answer2) {
      if (existPreferences) {
        await Preferences.findOneAndUpdate(
          { author: user._id },
          { $push: { details: [imgTitle, answer1, answer2] } },
        );
      } else {
        await Preferences.create({
          author: user._id,
          details: [imgTitle, answer1, answer2],
        });
      }
    }

    revalidatePath("/");
    return {
      message: "Story created successfully.",
      status: 201,
    };
  } catch (err) {
    console.log(err);
    return { message: "Error creating a story", status: 500 };
  }
}

/*** GET LOGGED IN USER DATA ***/
export async function getLoggedInUserData(): Promise<GetLoggedInUserDataResponse | null> {
  try {
    await dbConnect();

    const userEmail = cookies().get("userEmail")?.value;

    if (!userEmail) {
      return { message: "userEmail is required.", status: 400 };
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return { message: "Failed", status: 500 };
    }

    // Get user preferences.
    const userPreferences = await Preferences.findOne({ author: user._id });

    return {
      user,
      userPreferences: userPreferences || undefined,
      message: "Done",
      status: 200,
    };
  } catch (err) {
    console.log(err);
    return { message: "Failed", status: 500 };
  }
}

/*** GET USER STORIES ***/
export async function getUserStories() {
  try {
    await dbConnect();

    const currentUser = await getLoggedInUserData();
    if (!currentUser?.user) {
      return null;
    }

    console.log({ currentUser });

    const stories = await Story.find({ author: currentUser?.user._id });

    if (!stories) {
      return null;
    }

    return { stories };
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getRecentStories(): Promise<any> {
  try {
    await dbConnect();

    const currentUser = await getLoggedInUserData();
    if (!currentUser?.user) {
      return null;
    }

    const stories = await Story.find({ author: currentUser?.user._id })
      .sort({ createdAt: -1 })
      .limit(3);

    if (!stories) {
      return null;
    }

    return { stories };
  } catch (err) {
    console.log(err);
    return null;
  }
}

/*** GET USER STORIES ***/
export async function getStory({ storyId }: { storyId: string }) {
  try {
    await dbConnect();

    if (!storyId) {
      return {
        message: "storyId is required.",
        status: 400,
      };
    }

    const storyData = await Story.findOne({ _id: storyId }).populate({
      path: "author",
      model: User,
    });

    if (!storyData) {
      return {
        message: "Failed to fetch story!",
        status: 500,
      };
    }

    return { storyData: JSON.stringify(storyData) };
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Create new preference
export async function CreatePreference({
  author,
  details,
}: {
  author: string;
  details: string;
}) {
  try {
    await dbConnect();

    if (!author) {
      return {
        message: "author is required.",
        status: 400,
      };
    }

    const existPreferences = await Preferences.findOne({ author });
    let newRecord;

    console.log({ existPreferences });

    if (existPreferences) {
      await Preferences.findOneAndUpdate({ author }, { $push: { details } });
    } else {
      newRecord = await Preferences.create({
        author,
        details,
      });
      if (!newRecord) {
        return {
          message: "something went wrong with db.",
          status: 500,
        };
      }
    }

    return {
      message: "Created.",
      status: 200,
    };
  } catch {
    return {
      message: "Failed",
      status: 500,
    };
  }
}

// Save a mainImgUrl of story.
export async function saveStoryMainImage({
  mainImgUrl,
  storyId,
}: {
  mainImgUrl: string;
  storyId: string;
}) {
  if (!mainImgUrl || !storyId) {
    return { error: JSON.stringify("mainImgUrl, and syoryId are required!") };
  }
  try {
    await dbConnect();

    const story = await Story.findById({ _id: storyId });

    if (story?.mainImgUrl) {
      await Story.findOneAndUpdate(
        { _id: storyId },
        { mainImgUrl },
        { new: true },
      );
    } else {
      await Story.findByIdAndUpdate(
        { _id: storyId },
        { $set: { mainImgUrl } },
        { new: true },
      );
    }

    return;
  } catch {
    return { error: JSON.stringify({ error: "Error", status: 500 }) };
  }
}

// Increase user's points
export async function increaseUserPoints({ userId }: { userId: string }) {
  if (!userId) {
    return JSON.stringify({ error: "userId is required!", status: 400 });
  }

  console.log({ userId });

  try {
    await dbConnect();

    const res = await User.findByIdAndUpdate(
      { _id: userId },
      { $inc: { rank: 2 } },
    );

    if (!res) {
      return JSON.stringify({ error: "Error", status: 500 });
    }

    return JSON.stringify({ message: "Done.", status: 200 });
  } catch (err) {
    return JSON.stringify({
      error: err instanceof Error ? err.message : "Error",
      status: 500,
    });
  }
}
