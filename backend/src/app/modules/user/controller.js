import bcrypt from "bcryptjs";
// import { createOtpDB, deleteOtpDB, findOtpDB } from "../otp/services.js";
// import {
//   createEmailOptions,
//   createEmailTransporter,
// } from "../../utils/emails.js";
import {
  createUserDB,
  checkIfExists,
  updateUserVerificationStatus,
  comparePass,
} from "./service.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { loginSchema, signUpSchema } from "../../validator/userValidator.js";
import { createToken } from "../../utils/createToken.js";


const userSignUpControllerTemp = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!req.body || Object.keys(req.body).length === 0) {
    return errorResponse(res, 400, "Request body cannot be empty");
  }
  const { error } = signUpSchema.validate(req.body);
  if (error) {
    return errorResponse(res, 400, error.details[0].message);
  }

  const userExist = await checkIfExists(email);
  if (userExist) {
    return errorResponse(res, 409, "User Already Exists");
  }
  // const otp = await createOtpDB(email);


  await createUserDB({
    email: email,
    name: name,
    isVerified: true,
    password: password,
    role: "user",
  });
  return successResponse(res, 202, {
    message: "account created successfully",
    data: {},
  });
});


// const userSignUpController = catchAsync(async (req, res, next) => {
//   const { name, email, password } = req.body;

//   if (!req.body || Object.keys(req.body).length === 0) {
//     return errorResponse(res, 400, "Request body cannot be empty");
//   }
//   const { error } = signUpSchema.validate(req.body);
//   if (error) {
//     return errorResponse(res, 400, error.details[0].message);
//   }

//   const userExist = await checkIfExists(email);
//   if (userExist) {
//     return errorResponse(res, 409, "User Already Exists");
//   }
//   const otp = await createOtpDB(email);

//   const transporter = createEmailTransporter();

//   const mailOptions = createEmailOptions(email, otp, "sign up");

//   await transporter.sendMail(mailOptions);

//   await createUserDB({
//     email: email,
//     name: name,
//     isVerified: false,
//     password: password,
//     role: "user",
//   });
//   return successResponse(res, 202, {
//     message: "OTP sent to your email",
//     data: {},
//   });
// });

// const verifyUserOtpController = catchAsync(async (req, res, next) => {
//   const { email, otp } = req.body;

//   const dbOtp = await findOtpDB(email);
//   if (!dbOtp) {
//     return successResponse(res, 408, { message: "OTP time expired!" });
//   }

//   const matched = await bcrypt.compare(otp, dbOtp.otp);
//   if (!matched) {
//     return successResponse(res, 401, { message: "Invalid OTP" });
//   }

//   const user = await updateUserVerificationStatus(email, true);

//   if (!user) {
//     return successResponse(res, 500, {
//       message: "Internal server error. Please try again!",
//     });
//   }

//   const payload = {
//     email: user.email,
//     role: user.role,
//   };

//   const token = await createToken(payload);

//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 24 * 60 * 60 * 1000,
//   });

//   await deleteOtpDB(email);
//   return successResponse(res, 200, {
//     success: true,
//     message: "Verification successful",
//     data: {
//       token,
//     },
//   });
// });

const userLoginController = catchAsync(async (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return errorResponse(res, 400, "Request body cannot be empty");
  }
  const { email, password } = req.body;
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return errorResponse(res, 400, error.details[0].message);
  }
  const userExist = await checkIfExists(email);
  if (!userExist) {
    return errorResponse(res, 409, "User does not exists!");
  }

  const matched = await comparePass(password, userExist.password);

  if (!matched) {
    return errorResponse(res, 401, "Invalid email or password!");
  }
  const payload = {
    _id: userExist._id,
    email: userExist.email,
    role: userExist.role,
  };

  const token = await createToken(payload);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return successResponse(res, 200, {
    success: true,
    message: "Verification successful",
    data: {
      token,
    },
  });
});

export { userSignUpControllerTemp,  userLoginController };
