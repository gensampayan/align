import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    image: {
      path: {
        type: String,
        required: [false]
      },
      filename: {
        type: String,
        required: [false]
      }
    },
    firstName: {
      type: String,
      required: [true, "First name field is required."],
      minlength: 2,
      maxlength: 255
    },
    lastName: {
      type: String,
      required: [true, "Last name field is required."],
      minlength: 2,
      maxlength: 255
    },
    location: {
      type: String,
      required: [true, "Location field is required."]
    },
    email: {
      type: String,
      required: [true, "Email field is required."],
      unique: true
    },
    password: {
      type: String,
      required: [true, "Password field is required."]
    }
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

export default User;
