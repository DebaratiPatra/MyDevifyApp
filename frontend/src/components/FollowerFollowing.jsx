import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../axios";

const FollowerFollowing = ({ userId }) => {
  const { currentUser } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Followers
    makeRequest.get(`/relationships/followers?followedUserId=${userId}`)
      .then(res => setFollowers(res.data))
      .catch(err => console.error(err));

    // Following
    makeRequest.get(`/relationships/following?followerUserId=${userId}`)
      .then(res => setFollowing(res.data))
      .catch(err => console.error(err));

    // Posts count
    makeRequest.get(`/posts?userId=${userId}`)
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div className="p-4 bg-base-100 rounded shadow-md mb-4">
      <h3 className="font-bold text-lg mb-2">User Stats</h3>
      <div className="flex justify-between text-center">
        <div>
          <strong>{posts.length}</strong>
          <p>Posts</p>
        </div>
        <div>
          <strong>{followers.length}</strong>
          <p>Followers</p>
        </div>
        <div>
          <strong>{following.length}</strong>
          <p>Following</p>
        </div>
      </div>
    </div>
  );
};

export default FollowerFollowing;
