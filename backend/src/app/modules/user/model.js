import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //   validator: function (v) {
    //     // Check if email ends with '@diu.edu.bd'
    //     return /@diu\.edu\.bd$/.test(v);
    //   },
    //   message: (props) =>
    //     `${props.value} is not a valid Daffodil International University email!`,
    // },
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
    user.password = await bcrypt.hash(user.password, 10);
  next();
});

userSchema.statics.isUserExistsByCustomId = async function (email) {
  if (id) {
    return await UserModel.findOne({ email }).select(
      "+password"
    );
  }
  return await UserModel.findOne({ email }).select("+password");
};


userSchema.statics.isPasswordMatched = async function (password, hashPassword) {
  return bcrypt.compare(password, hashPassword);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;