import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const checkUserQuery = "SELECT * FROM users WHERE username = ?";

  db.query(checkUserQuery, [req.body.username], (err, data) => {
    if (err) {
      console.error("Database error during register:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (data.length) {
      return res.status(409).json({ message: "User already exists!" });
    }

    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      const insertUserQuery = `
        INSERT INTO users (username, email, password, name) 
        VALUES (?, ?, ?, ?)
      `;
      const values = [
        req.body.username,
        req.body.email,
        hashedPassword,
        req.body.name,
      ];

      db.query(insertUserQuery, values, (err) => {
        if (err) {
          console.error("Database error inserting user:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        return res.status(200).json({ message: "User has been created." });
      });

    } catch (error) {
      console.error("Error hashing password:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};


export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) {
      console.error("Database error during login:", err); // log full error on server
      return res.status(500).json({ message: "Internal server error" }); // send safe message to client
    }

    if (data.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);

    if (!checkPassword) {
      return res.status(400).json({ message: "Wrong password or username!" });
    }

    const token = jwt.sign({ id: data[0].id }, "secretkey");

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};


export const logout = (req, res) => {
  //console.log("working")
  res.clearCookie("accessToken",{
    secure:true,
    sameSite:"none"
  }).status(200).json("User has been logged out.")
};