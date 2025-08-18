import { useState } from "react";
import StoryViewer from "./StoryViewer";

const StoryThumbnail = ({ story, allStories = [], currentUser, onDelete }) => {
  const [openViewer, setOpenViewer] = useState(false);

  if (!story) return null;

  return (
    <>
      <img
        src={story.img ? `http://localhost:8800${story.img}` : "/default-story.png"}
        alt={story.username || "Story"}
        className="w-24 h-24 object-cover rounded-full cursor-pointer"
        onClick={() => setOpenViewer(true)}
      />

      {openViewer && (
        <StoryViewer
          stories={allStories.length > 0 ? allStories : [story]}
          currentStoryId={story.id}
          onClose={() => setOpenViewer(false)}
          currentUser={currentUser}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default StoryThumbnail;