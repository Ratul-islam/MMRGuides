import { SECRET } from "../config/index.js";
import jwt from "jsonwebtoken";
import { successResponse } from "../utils/response.js";
import { catchAsync } from "../utils/catchAsync.js";

const checkToken = catchAsync(async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return successResponse(res, 401, {
      message: "Need a valid token to process requests",
    });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, SECRET);
  } catch (err) {
    return successResponse(res, 401, {
      message: "The token is invalid or has expired!",
    });
  }

  req.tokenId = decodedToken._id;

  if (req.body && typeof req.body === 'object') {
    req.body.tokenId = decodedToken._id;
  }

  next();
});

export { checkToken };
