import { Document, Model, model, models, Schema } from "mongoose";

interface IStory extends Document {
  author: Schema.Types.ObjectId;
  storyTitle: string;
  story: string;
  imgUrl: string;
  mainImgUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const StorySchema = new Schema<IStory>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    storyTitle: { type: String, required: true },
    story: { type: String, required: true },
    imgUrl: { type: String, required: true },
    mainImgUrl: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

const Story = models.Story || model<IStory>("Story", StorySchema);

export default Story as Model<IStory>;
