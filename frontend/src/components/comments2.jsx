import { useState } from "react";
import { makeRequest } from "../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";

// eslint-disable-next-line react/prop-types
const Comments = ({ postId }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [desc, setDesc] = useState("");

  const queryClient = useQueryClient();

  // Fetch comments for this post
  const { isLoading, data: comments, error } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + postId).then((res) => res.data),
  });

  // Mutation to add a new comment
  const addCommentMutation = useMutation({
    mutationFn: (newComment) => makeRequest.post("/comments", newComment),
    onSuccess: () => {
      // Refresh comments for this post
      queryClient.invalidateQueries(["comments", postId]);
      setDesc(""); // Clear input
    },
  });

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc.trim()) return; // prevent empty comments
    addCommentMutation.mutate({ desc, postId });
  };

  return (
    <div className="collapse-container mt-4">
      <button
        className="collapse-toggle font-semibold mb-2"
        onClick={handleCollapse}
      >
        Comments ({comments ? comments.length : 0})
        <i className={`fas fa-chevron-${isCollapsed ? "down" : "up"} ml-2`}></i>
      </button>

      {!isCollapsed && (
        <div className="comment-section">
          <form className="mb-4" onSubmit={handleSubmit}>
            <textarea
              rows="3"
              className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring"
              placeholder="Write a comment..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Post Comment
            </button>
          </form>

          {isLoading ? (
            <p>Loading comments...</p>
          ) : error ? (
            <p className="text-red-500">Failed to load comments</p>
          ) : comments.length === 0 ? (
            <p>No comments yet. Be the first!</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex mb-4 p-3 bg-gray-100 rounded-md space-x-3"
              >
                {/* <img
                  src={
                    comment.profilePic
                      ? `http://localhost:5173/uploads/posts/${comment.profilePic}`
                      : "http://localhost:5173/default/default_profile.png"
                  }
                  alt={comment.name}
                  className="w-8 h-8 rounded-full object-cover"
                /> */}
                <div>
                  <p className="font-semibold text-sm">{comment.name}</p>
                  <p className="text-xs text-gray-500 mb-1">
                    {moment(comment.createdAt).fromNow()}
                  </p>
                  <p className="text-sm">{comment.desc}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;