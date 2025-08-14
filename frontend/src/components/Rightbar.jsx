import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { AuthContext } from "../context/AuthContext";
import FollowerFollowing from "./FollowerFollowing";
import { Link } from "react-router-dom";

const Rightbar = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch suggested users (users currentUser is not following)
  const { data: suggestedUsers } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: () =>
      makeRequest
        .get(`/users/suggested/${currentUser.id}`)
        .then((res) => res.data),
  });

  // Mutation for follow/unfollow
  const mutation = useMutation({
    mutationFn: ({ userId, action }) =>
      action === "follow"
        ? makeRequest.post("/relationships", { userId })
        : makeRequest.delete(`/relationships?userId=${userId}`),
    onSuccess: () => queryClient.invalidateQueries(["suggestedUsers"]),
  });

  const handleFollowToggle = (user) => {
    const isFollowing = user.followers?.includes(currentUser.id);
    const action = isFollowing ? "unfollow" : "follow";
    mutation.mutate({ userId: user.id, action });
  };

  // Fetch **current user's posts count only**
  const { data: myPosts } = useQuery({
    queryKey: ["myPosts"],
    queryFn: () =>
      makeRequest
        .get(`/posts?userId=${currentUser.id}`)
        .then((res) => res.data),
  });

  // Fetch trending posts (others' posts for home page)
  const { data: trendingPosts } = useQuery({
    queryKey: ["trendingPosts"],
    queryFn: () =>
      makeRequest.get("/posts?limit=5").then((res) => res.data),
  });

  return (
    <div className="sticky top-0 p-4 space-y-6 w-64 bg-base-100 rounded-lg shadow">
      {/* Your stats - only current user */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Your Stats</h3>
        <p>Posts: {myPosts?.length || 0}</p>
        <FollowerFollowing userId={currentUser.id} />
      </div>

      <div className="divider"></div>

      {/* Suggested Users */}
      <div>
        <h3 className="font-semibold mb-2">Suggested Users</h3>
        {suggestedUsers?.length === 0 && <p>No suggestions</p>}
        <ul className="space-y-2">
          {suggestedUsers?.map((user, index) => {
            const isFollowing = user.followers?.includes(currentUser.id);
            return (
              <li
                key={`${user.id}-${index}`} // <-- unique key
                className="flex justify-between items-center"
              >
                <Link to={`/profile/${user.id}`} className="text-blue-500">
                  {user.username}
                </Link>
                <button
                  onClick={() => handleFollowToggle(user)}
                  className={`text-xs px-2 py-1 rounded ${
                    isFollowing
                      ? "bg-gray-300 text-black"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="divider"></div>

      {/* Trending Posts */}
      <div>
        <h3 className="font-semibold mb-2">Trending Posts</h3>
        <ul className="space-y-2">
          {trendingPosts?.map((post, index) => (
            <li key={`${post.id}-${index}`}>
              <Link to={`/profile/${post.userId}`} className="font-semibold">
                {post.username}:
              </Link>{" "}
              <span>{post.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Rightbar;
