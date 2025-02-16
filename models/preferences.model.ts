import { Document, Model, model, models, Schema } from "mongoose";

export interface IPreferences extends Document {
  author: Schema.Types.ObjectId;
  details: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PreferencesSchema = new Schema<IPreferences>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    details: [{ type: String, required: true }],
  },
  { timestamps: true },
);

const Preferences =
  models.Preferences || model<IPreferences>("Preferences", PreferencesSchema);

export default Preferences as Model<IPreferences>;
