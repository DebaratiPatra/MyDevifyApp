/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import Post from "./Post";

const Posts = ({ excludeUserId }) => {
  // Fetch all posts from backend
  const { isLoading, error, data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: () => makeRequest.get("/posts").then(res => res.data),
  });

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts</div>;

  // Optionally exclude posts from a specific user
  const filteredPosts = excludeUserId
    ? posts.filter(post => post.userId !== excludeUserId)
    : posts;

  return (
    <div className="flex flex-col w-full space-y-4">
      {filteredPosts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;


// import { useQuery } from "@tanstack/react-query";
// import { makeRequest } from "../axios";
// import Post from "./Post";

// const Posts = ({ userId, excludeUserId }) => {
//   const { isLoading, data: posts, error } = useQuery({
//     queryKey: ["posts", userId, excludeUserId],
//     queryFn: () => {
//       if (userId) {
//         // Profile page → fetch only this user's posts
//         return makeRequest.get("/posts?userId=" + userId).then(res => res.data);
//       } else {
//         // Home page → fetch all posts
//         return makeRequest.get("/posts").then(res => res.data);
//       }
//     },
//   });

//   if (isLoading) return <p>Loading posts...</p>;
//   if (error) return <p>Error loading posts!</p>;

//   // Filter out current user's posts if excludeUserId is provided
//   const filteredPosts = excludeUserId
//     ? posts.filter(post => post.userId !== excludeUserId)
//     : posts;

//   return (
//     <div className="flex flex-col gap-4 mt-4">
//       {filteredPosts.map(post => (
//         <Post key={post.id} post={post} />
//       ))}
//     </div>
//   );
// };

// export default Posts;
