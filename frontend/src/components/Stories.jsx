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

  return (
    <div className="grid place-items-center">
      <div className="max-w-96 xl:max-w-3xl flex space-x-4 overflow-x-auto p-4 bg-base-200">
        {/* Add Story Card */}
        <div className="card bg-base-100 shadow-xl flex-shrink-0 w-48">
          <div className="card-body p-0">
            <img
              src="/default-add-story.png"
              alt="Add Story"
              className="w-full h-32 object-cover"
            />
          </div>
          <div className="card-footer text-center">
            <button
              className="text-xs font-semibold"
              onClick={() => setAddStory(true)}
            >
              Add Story
            </button>
          </div>
        </div>

        {/* Render each story */}
        {stories?.map((story) => (
          <StoryThumbnail
            key={story.id}
            story={story}
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
