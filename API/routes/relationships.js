import express from "express";
import { getFollowers, getFollowing, followUser, unfollowUser } from "../controllers/relationship.js";
const router = express.Router();

router.get("/followers", getFollowers);       // expects ?followedUserId=
router.get("/following", getFollowing);       // expects ?followerUserId=
router.post("/", followUser);                 // body: { userId }
router.delete("/", unfollowUser);            // body: { userId }

export default router;