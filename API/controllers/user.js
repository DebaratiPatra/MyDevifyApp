import { db } from "../connect.js";
import jwt from "jsonwebtoken";

// Get user by ID
export const getUser = (req, res) => {
  const userId = req.params.id;

  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json({ message: "User not found" });
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

// Update user profile
export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `username`=?, `name`=?, `bio`=?, `instagram`=?, `website`=?, `profilePic`=?, `coverPic`=? WHERE id=?";

    db.query(
      q,
      [
        req.body.username,
        req.body.name,
        req.body.bio,
        req.body.instagram,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id, // ensures only current user can update
      ],
      (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0) {
          // Return updated user data
          const q2 = "SELECT * FROM users WHERE id=?";
          db.query(q2, [userInfo.id], (err2, updatedData) => {
            if (err2) return res.status(500).json(err2);
            const { password, ...info } = updatedData[0];
            return res.json(info);
          });
        } else return res.status(403).json("You can update only your profile!");
      }
    );
  });
};



export const searchUsers = (req, res) => {
  const q = "SELECT id, username FROM users WHERE username LIKE ?";
  const searchTerm = `%${req.query.username}%`;
  db.query(q, [searchTerm], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getSuggestedUsers = (req, res) => {
  const currentUserId = req.params.id;
  const q = `
    SELECT id, username, profilePic 
    FROM users 
    WHERE id != ? 
    AND id NOT IN (SELECT followedUserId FROM relationships WHERE followerUserId = ?)
  `;
  db.query(q, [currentUserId, currentUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};