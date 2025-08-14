import { useState } from "react";
import StoryViewer from "./StoryViewer";

const StoryThumbnail = ({ story, allStories = [], currentUser, onDelete }) => {
  const [openViewer, setOpenViewer] = useState(false);

  if (!story) return null; // safeguard

  return (
    <>
      <img
        src={story.img ? `http://localhost:5173/uploads/posts/${story.img}` : "/default-story.png"}
        alt={story.username || "Story"}
        className="w-24 h-24 object-cover rounded-full cursor-pointer"
        onClick={() => setOpenViewer(true)}
      />

      {openViewer && (
        <StoryViewer
          stories={allStories.length > 0 ? allStories : [story]} // fallback to single story
          currentStoryId={story.id}
          onClose={() => setOpenViewer(false)}
          currentUser={currentUser} // pass currentUser
          onDelete={onDelete}       // pass delete function
        />
      )}
    </>
  );
};

export default StoryThumbnail;
