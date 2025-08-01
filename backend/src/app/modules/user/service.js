import UserModel from "./model.js";

const createUserDB = async ({ id, email, isVerified, password, role }) => {
  const user = await UserModel.create({
    id,
    email,
    isVerified,
    password,
    role,
  });
  return user;
};

const checkIfExists = async (email) => {
  const userEmailExists = await UserModel.findOne({email:email});
  (userEmailExists)
  if (userEmailExists) {
    return userEmailExists;
  }
  return 0;
};

const comparePass = async ( password, hashedPassword) => {
  const isMatched = await UserModel.isPasswordMatched(password, hashedPassword);
  if(isMatched) return isMatched;

  return 0;
};

const updateUserVerificationStatus = async (email, isVerified) => {
  return await UserModel.findOneAndUpdate(
    { email },
    { isVerified },
    { new: true }
  );
};


export { createUserDB,checkIfExists,updateUserVerificationStatus,comparePass};
