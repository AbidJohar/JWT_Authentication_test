import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateToken = (payload) =>
    jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

// ─── REGISTER ────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
    try {
        const { username, fullname, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
        });

        if (existingUser) {
            const field = existingUser.username === username.toLowerCase() ? "Username" : "Email";
            return res.status(409).json({ success: false, message: `${field} already taken` });
        }

        const user = await User.create({ username, fullname, email, password });

        const token = generateToken({ id: user._id, username: user.username });

        res.cookie("accessToken", token, COOKIE_OPTIONS);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                id: user._id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken({ id: user._id, username: user.username });

        res.cookie("accessToken", token, COOKIE_OPTIONS);

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
export const logout = (req, res) => {
    res.clearCookie("accessToken", COOKIE_OPTIONS);
    return res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ─── ME (protected example) ──────────────────────────────────────────────────
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        return res.status(200).json({ success: true, user });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};