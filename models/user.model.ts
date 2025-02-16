import { Document, Model, model, models, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  stories: Schema.Types.ObjectId[];
  rank: number;
  preferences: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    stories: [{ type: Schema.Types.ObjectId, ref: "Stories" }],
    rank: { type: Number, default: 0 },
    preferences: [{ type: String, required: true, default: [""] }],
  },
  { timestamps: true },
);

const User = models.User || model<IUser>("User", UserSchema);

export default User as Model<IUser>;
