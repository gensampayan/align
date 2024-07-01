import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."]
    },
    title: {
      type: String,
      minlength: 5,
      maxlength: 255,
      required: [true, "Title is required."]
    },
    description: {
      type: String,
      minlength: 5,
      maxlength: 255,
      required: [true, "Description is required."]
    },
    image: {
      path: {
        type: String
      },
      filename: {
        type: String
      }
    },
    location: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: [true, "Location is required."]
    },
    category: {
      type: String,
      minlength: 5,
      maxlength: 255,
      required: [true, "Category is required."]
    },
    isOpen: {
      type: Boolean,
      default: true,
      required: [true, "Status is required."]
    },
    attendees: {
      type: String,
      minlength: 1,
      maxlength: 100
    },
    date: {
      type: String,
      required: [true, "Date is required."]
    },
    time: {
      type: String,
      required: [true, "Time is required."]
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Event = model("Event", eventSchema);
export default Event;
