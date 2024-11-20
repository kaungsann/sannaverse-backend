import { Response, Request } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("req body is a", req.body);
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !username || !password || !email) {
      res.status(400).json({ error: "Please fill in all fields" });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords don't match" });
      return;
    }

    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
    return;
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    generateToken(user.id, res);

    if (!isPasswordCorrect) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }
    // Remove password before sending the response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    console.log("user is a", userWithoutPassword);

    res
      .status(200)
      .json({ message: "Login successful", user: userWithoutPassword });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
