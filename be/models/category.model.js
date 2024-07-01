import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    categoryType: {
      type: String,
      ref: "Event",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Category = model("Category", categorySchema);
export default Category;
