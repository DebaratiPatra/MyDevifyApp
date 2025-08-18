import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { AuthContext } from "../context/AuthContext";

import AddStory from "./addStory";
import StoryThumbnail from "./Story/StoryThumbnail";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [openAddStory, setAddStory] = useState(false);
  const queryClient = useQueryClient();

  // Fetch stories (pass currentUser.id)
  const { isLoading, data: stories, error } = useQuery({
    queryKey: ["stories"],
    queryFn: () =>
      makeRequest
        .get(`/stories?userId=${currentUser.id}`)
        .then((res) => res.data),
  });

  // Delete story mutation
  const deleteMutation = useMutation({
    mutationFn: (storyId) => makeRequest.delete(`/stories/${storyId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["stories"] }),
  });

  const handleDeleteStory = (storyId) => deleteMutation.mutate(storyId);

  if (isLoading) return <p>Loading stories...</p>;
  if (error) return <p>Error loading stories!</p>;

  // Group stories by userId
  const groupedStories = stories?.reduce((acc, story) => {
    if (!acc[story.userId]) {
      acc[story.userId] = { user: story, stories: [story] };
    } else {
      acc[story.userId].stories.push(story);
    }
    return acc;
  }, {});

  return (
    <div className="grid place-items-center">
      <div className="max-w-96 xl:max-w-3xl flex space-x-4 overflow-x-auto p-4 bg-base-200">
        
        <div className="card bg-base-100 shadow-xl flex-shrink-0 w-48">
          
          <div className="card-footer text-center">
            <button
              className="text-xs font-semibold"
              onClick={() => setAddStory(true)}
            >
              Add Story
            </button>
          </div>
        </div>

        {/* Render grouped stories */}
        {Object.values(groupedStories || {}).map(({ user, stories }) => (
          <StoryThumbnail
            key={user.id}
            story={user}         // Use first story for thumbnail
            allStories={stories} // Pass all stories by this user
            currentUser={currentUser}
            onDelete={handleDeleteStory}
          />
        ))}
      </div>

      {/* Add Story Modal */}
      {openAddStory && (
        <AddStory setAddStory={setAddStory} currentUser={currentUser} />
      )}
    </div>
  );
};

export default Stories;
