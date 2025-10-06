import { NextFunction, Request, Response } from "express";
import { getJsonResponse } from "../../../utils/helperMethods/getJsonResponse.js";

export async function uploadPostImg(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //todo : use RabbitMQ to remove image if post is not published.
    const image = req?.file?.buffer;
    const fakeImgURL =
      "https://storage.googleapis.com/fir-auth-1c3bc.appspot.com/1694290122808-71AL1tTRosL._SL1500_.jpg";

    return res.status(201).json(
      getJsonResponse({
        message: "Image uploaded successfully",
        data: fakeImgURL,
      })
    );
  } catch (error) {
    return next(error);
  }
}
