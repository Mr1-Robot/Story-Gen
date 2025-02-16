import { IPreferences } from "@/models/preferences.model";
import { IUser } from "@/models/user.model";
import { Schema } from "mongoose";
import React from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";

export interface SidebarLinkTypes {
  id: number;
  title: string;
  route: string;
  icon: React.ReactNode;
}

export interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: SubmitHandler<T>;
  formType: "SIGN_IN" | "SIGN_UP";
}

/***  ACTIONS TYPES ***/

export interface CreateUserParams {
  email: string;
  name: string;
  password: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface CreateUserResponse {
  message: string;
  status: number;
}

export interface SignInResponse {
  message: string;
  status: number;
}

export interface GenerateImageResponse {
  question: string;
  images: { title: string; url: string }[];
}

export interface CreateStoryResponse {
  message: string;
  status: number;
}

export interface CreateStoryParams {
  author: string;
  storyTitle: string;
  story: string;
  imgUrl: string;
  imgTitle: string;
  answer1?: string;
  answer2?: string;
}

export interface GetLoggedInUserDataResponse {
  message: string;
  status: number;
  user?: IUser;
  userPreferences?: IPreferences;
}

export interface GetUserStoriesResponse {
  _id: Schema.Types.ObjectId | string;
  author: Schema.Types.ObjectId | string;
  storyTitle: string;
  story: string;
  imgUrl: string;
  createdAt: Date;
}

export interface RankCardPropsTypes {
  title: string;
  rank: number;
  url: string;
}

export interface StoryCardProps {
  _id: string;
  imgUrl: string;
  storyTitle: string;
  story: string;
  createdAt: string;
}
