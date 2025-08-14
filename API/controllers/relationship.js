import { db } from "../connect.js";
// import jwt from "jsonwebtoken";

export const followUser = (req, res) => {
  const followerUserId = req.body.userId; // current user
  const followedUserId = req.body.followedUserId; // target user

  const q = "INSERT INTO relationships (followerUserId, followedUserId) VALUES (?, ?)";
  db.query(q, [followerUserId, followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json("User followed successfully");
  });
};

// Unfollow a user
export const unfollowUser = (req, res) => {
  const followerUserId = req.body.userId; // current user
  const followedUserId = req.body.followedUserId; // target user

  const q = "DELETE FROM relationships WHERE followerUserId = ? AND followedUserId = ?";
  db.query(q, [followerUserId, followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json("User unfollowed successfully");
  });
};

export const getFollowers = (req, res) => {
  const followedUserId = req.query.followedUserId;
  const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";
  db.query(q, [followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data.map(row => row.followerUserId));
  });
};

export const getFollowing = (req, res) => {
  const followerUserId = req.query.followerUserId;
  const q = "SELECT followedUserId FROM relationships WHERE followerUserId = ?";
  db.query(q, [followerUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data.map(row => row.followedUserId));
  });
};