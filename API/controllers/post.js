import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";


export const getPosts = (req, res) => {
  const userId = req.query.userId;        // optional: fetch only this user's posts
  const excludeUserId = req.query.excludeUserId;  // optional: fetch all except this user

  let q;
  let params = [];

  if (userId) {
    // Return only this user's posts
    q = "SELECT p.*, u.username FROM posts p JOIN users u ON p.userId = u.id WHERE p.userId = ?";
    params = [userId];
  } else if (excludeUserId) {
    // Return all posts except this user
    q = "SELECT p.*, u.username FROM posts p JOIN users u ON p.userId = u.id WHERE p.userId != ?";
    params = [excludeUserId];
  } else {
    // Return all posts if no filter
    q = "SELECT p.*, u.username FROM posts p JOIN users u ON p.userId = u.id";
  }

  db.query(q, params, (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};


// export const getPosts = (req, res) => {
//   const userId = req.query.userId;
//   const token = req.cookies.accessToken;
//   if (!token) return res.status(401).json("Not logged in!");

//   jwt.verify(token, "secretkey", (err, userInfo) => {
//     if (err) return res.status(403).json("Token is not valid!");

//     const q = userId
//       ? "SELECT p.*, u.username, u.profilePic, u.name FROM posts AS p JOIN users AS u ON u.id=p.userId WHERE p.userId=? ORDER BY p.createdAt DESC"
//       : `SELECT p.*, u.username, u.profilePic, u.name
//          FROM posts AS p
//          JOIN users AS u ON u.id=p.userId
//          LEFT JOIN relationships AS r ON p.userId=r.followedUserId
//          WHERE r.followerUserId=? OR p.userId=? 
//          ORDER BY p.createdAt DESC`;

//     const values = userId ? [userId] : [userInfo.id, userInfo.id];

//     db.query(q, values, (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json(data);
//     });
//   });
// };


export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });


};


export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });
};

// Get timeline posts for a user (their posts + posts of people they follow)
export const getTimelinePosts = (req, res) => {
  const userId = req.params.userId;

  const q = `
    SELECT p.*, u.username, u.profilePic
    FROM posts p
    JOIN users u ON u.id = p.userId
    WHERE p.userId = ? 
       OR p.userId IN (
           SELECT followedUserId 
           FROM relationships 
           WHERE followerUserId = ?
       )
    ORDER BY p.createdAt DESC
  `;

  db.query(q, [userId, userId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};
