import Category from "../models/category.model.js";
import Event from "../models/event.model.js";
import { asyncHandler } from "../middlewares/error.middleware.js";

const createCategory = asyncHandler(async (req, res) => {
  const { categoryType } = req.body;

  const isCategoryExist = await Event.findOne({ categoryType });

  if (isCategoryExist) {
    res.status(400);
    throw new Error("Category already exists.");
  } else {
    const newCategory = new Category({
      categoryType
    });
    await newCategory.save();

    res.status(201).send({
      message: "New category created.",
      data: newCategory
    });
  }
});

const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(200).send({
    message: "List of categories.",
    data: categories
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const categoryById = await Category.findOne({ _id: categoryId });

  if (!categoryById) {
    res.status(404);
    throw new Error("Category not found.");
  } else {
    res.status(200).send({
      message: `Category with ID ${categoryId}`,
      data: {
        category: categoryById
      }
    });
  }
});

const updateCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const categoryById = await Category.findOne({ _id: categoryId });

  if (!categoryById) {
    res.status(404);
    throw new Error("Category not found.");
  } else {
    for (let key in req.body) {
      categoryById[key] = req.body[key];
    }
    const { matchedCount } = await Category.updateOne(
      { _id: categoryId },
      { $set: categoryById }
    );
    if (!matchedCount) {
      res.status(500);
      throw new Error(
        "Something went wrong while updating the category details."
      );
    } else {
      res.status(200).send({
        message: "Category details has been updated.",
        data: categoryById
      });
    }
  }
});

export { createCategory, getAllCategory, getCategoryById, updateCategoryById };
