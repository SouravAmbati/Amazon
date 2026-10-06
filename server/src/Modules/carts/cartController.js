import {
  AddToCartService,
  IncreaseCountService,
  RemoveFromCartService,
  GetCartService,
} from "./cartService.js";

export const AddToCartController = async (req, res) => {
  try {
    const { productId } = req.query;

    const { counts } = req.body;

    if (!productId || !counts) {
      return res.status(400).json({
        success: false,
        message: "productId and counts are required",
      });
    }

    const response = await AddToCartService(productId, Number(counts));

    res.status(201).json(response);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const RemoveFromCartController = async (req, res) => {
  try {
    const { productId } = req.query;

    const response = await RemoveFromCartService(productId);

    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const IncreaseProductCountController = async (req, res) => {
  try {
    const { productId } = req.query;

    const { counts } = req.body;

    const response = await IncreaseCountService(productId, Number(counts));

    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const GetCartController = async (req, res) => {
  try {
    const response = await GetCartService();

    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
