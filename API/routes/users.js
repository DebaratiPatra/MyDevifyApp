import express from "express";
import { getUser, updateUser, getSuggestedUsers, searchUsers } from "../controllers/user.js";
const router = express.Router();

router.get("/find/:id", getUser);         // fetch user profile
router.put("/", updateUser);              // update logged-in user's profile
router.get("/suggested/:id", getSuggestedUsers);
router.get("/search", searchUsers);

export default router;
