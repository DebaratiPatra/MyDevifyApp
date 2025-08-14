import express from "express";
import {getPosts, addPost,deletePost  } from "../controllers/post.js";
import { getTimelinePosts } from "../controllers/post.js";

const router=express.Router();

router.get("/",getPosts);
router.post("/",addPost);
router.delete("/:id",deletePost);

router.get("/timeline/:userId", getTimelinePosts);

export default router;