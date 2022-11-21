//file include
import mongoose from "mongoose";

//user schema create
const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    isAdmin: {
      type: String,
      trim: true,
      enum: ["admin", "editor", "author", "contributor", "subscribe"],
      default: "subscribe",
    },
    phone: {
      type: String,
      trim: true,
    },
    skill: {
      type: String,
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      trim: true,
    },
    gallery: {
      type: Array,
      trim: true,
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    follower: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    gender: {
      type: String,
      trim: true,
      enum: ["male", "female"],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timeStamps: true,
  }
);

// module export
export default mongoose.model("User", UserSchema);
