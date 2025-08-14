import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getStories = (req, res) => {
  const currentUserId = req.query.userId; // pass current user's id
  const q = `
    SELECT s.*, u.username
    FROM stories s
    JOIN users u ON s.userId = u.id
    WHERE s.userId = ? OR s.userId IN (
      SELECT followedUserId FROM relationships WHERE followerUserId = ?
    )
    ORDER BY s.createdAt DESC
  `;
  db.query(q, [currentUserId, currentUserId], (err, data) => {
    if(err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};



  
export const addStory = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const filename = req.file.filename;
    const q = "INSERT INTO stories (`userId`, `img`, `createdAt`) VALUES (?, ?, NOW())";
    db.query(q, [userInfo.id, filename], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("Story created successfully");
    });
  });
};

export const deleteStory = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM stories WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Story has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });
};
