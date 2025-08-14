import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { AuthContext } from "../context/AuthContext";
import Post from "./Post";
import StoryThumbnail from "./Story/StoryThumbnail";

const Feed = () => {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.id;

  // Fetch posts (current user + following users)
  const { isLoading, data: posts, error } = useQuery({
    queryKey: ["timelinePosts"],
    queryFn: () =>
      makeRequest.get(`/posts/timeline/${userId}`).then((res) => res.data),
  });

  // Fetch all stories
  const { isLoading: loadingStories, data: stories } = useQuery({
    queryKey: ["allStories"],
    queryFn: () => makeRequest.get("/stories").then((res) => res.data),
  });

  if (isLoading || loadingStories) return <p>Loading feed...</p>;
  if (error) return <p>Error loading feed!</p>;

  return (
    <div>
      {/* Stories at top */}
      <div className="flex space-x-4 overflow-x-auto mb-4">
        {stories?.map((story) => (
          <StoryThumbnail
            key={story.id}
            story={story}
            allStories={stories}
            currentUser={currentUser}
          />
        ))}
      </div>

      {/* Posts */}
      {posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
