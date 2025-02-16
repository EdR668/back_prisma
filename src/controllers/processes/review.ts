import { RequestHandler } from "express";
import { ReviewModel } from "../../models/processes/review";
import createHttpError from "http-errors";

export const createReview: RequestHandler = async (req, res, next) => {
  try {
    const reviewData = req.body;

    const newReview = await ReviewModel.create(reviewData);
    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
};

export const updateReview: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedReview = await ReviewModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).exec();

    if (!updatedReview) {
      throw createHttpError(404, `Review with ID ${id} not found`);
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    next(error);
  }
};

export const deleteReview: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedReview = await ReviewModel.findByIdAndDelete(id).exec();
    if (!deletedReview) {
      throw createHttpError(404, `Review with ID ${id} not found`);
    }

    res.status(200).json("Review successfully deleted");
  } catch (error) {
    next(error);
  }
};

export const showReview: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await ReviewModel.findById(id).exec();
    if (!review) {
      throw createHttpError(404, `Review with ID ${id} not found`);
    }

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};

export const showReviews: RequestHandler = async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find().exec();
    if (!reviews || reviews.length === 0) {
      throw createHttpError(404, "No reviews found");
    }

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};
