import { SECRET } from "../config/index.js";
import jwt from "jsonwebtoken";
import { successResponse } from "../utils/response.js";
import { catchAsync } from "../utils/catchAsync.js";



const checkToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];


  if (!token)
    return successResponse(res, 401, {
  message: "need valid token to process requests",
});


const deCodeToken = jwt.verify(token, SECRET);

if (!deCodeToken)
  return successResponse(res, 401, {
message: "The token is Invalid or has expired!",
});

  req.body.tokenId = deCodeToken._id;
  next();
});

export { checkToken };