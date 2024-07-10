import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { createAccessToken } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../middlewares/error.middleware.js";
import { cloudinary } from "../config/storage.js";

const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, location, email, password } = req.body;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    res.status(400);
    throw new Error("Email already exists.");
  } else {
    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      location,
      email,
      password: hash
    });
    await newUser.save();

    res.status(201).send({
      message: "User has been created.",
      data: newUser
    });
  }
});

const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User does not exist.");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      res.status(400);
      throw new Error("Password didn't match.");
    } else {
      res.status(200).send({
        message: "Login successful.",
        data: {
          name: user.firstName,
          accessToken: createAccessToken(user)
        }
      });
    }
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const userById = await User.findOne({ _id: userId }).select([
    "-updatedAt",
    "-password",
    "-createdAt"
  ]);

  if (!userById) {
    res.status(404);
    throw new Error("User not found.");
  } else {
    res.status(200).send({
      message: `User ID ${userId}`,
      data: userById
    });
  }
});

const editUserById = asyncHandler(async (req, res) => {
  const { userId, firstName, lastName, location, email, password } = req.body;
  const { path, filename } = req.file;
  const userById = await User.findOne({ _id: userId });
  if (!userById) {
    res.status(404);
    throw new Error("User not found.");
  } else {
    if (firstName) userById.firstName = firstName;
    if (lastName) userById.lastName = lastName;
    if (location) userById.location = location;
    if (email) userById.email = email;
    if (password) userById.password = await bcrypt.hash(password, 10);
    if (path && filename) {
      if (userById.image.path && userById.image.filename) {
        const { result } = await cloudinary.uploader.destroy(
          `${userById.image.filename}`
        );
        if (!result) {
          res.status(500).send({
            message: "Something went wrong while deleting the photo ID."
          });
        }
      }
      userById.image.path = path;
      userById.image.filename = filename;
    }
    const { matchedCount } = await User.updateOne(
      { _id: userId },
      { $set: userById }
    );
    if (!matchedCount) {
      res.status(500);
      throw new Error(
        "Something went wrong while updating the borrower details."
      );
    } else {
      res.status(200).send({
        message: "User details has been updated.",
        data: [userById, path, filename]
      });
    }
  }
});

export { signup, signin, getUserById, editUserById };
