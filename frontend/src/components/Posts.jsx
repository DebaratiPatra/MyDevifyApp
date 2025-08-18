/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import Post from "./Post";

const Posts = ({ userId }) => {
  // Fetch posts from backend
  const { isLoading, error, data: posts } = useQuery({
    queryKey: userId ? ["posts", userId] : ["posts"],
    queryFn: () =>
      makeRequest
        .get(userId ? `/posts?userId=${userId}` : "/posts")
        .then((res) => res.data),
  });

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div className="flex flex-col w-full space-y-4">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet.</p>
      ) : (
        posts.map((post) => <Post key={post.id} post={post} />)
      )}
    </div>
  );
};

export default Posts;
