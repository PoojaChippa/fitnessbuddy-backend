import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Create Auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const userId = data.user.id;

    // Create profile row
    const { error: profileError } = await supabase.from("users").insert({
      id: userId,
      name,
    });

    if (profileError) throw profileError;

    //  Create JWT
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      token,
    });
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const token = jwt.sign({ id: data.user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};
