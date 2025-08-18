import { useState, useEffect, useRef } from "react";

const StoryViewer = ({ stories = [], currentStoryId, onClose, currentUser, onDelete }) => {
  const initialIndex = stories.findIndex((s) => s.id === currentStoryId);
  const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  if (!stories || stories.length === 0) return null;

  const currentStory = stories[currentIndex];

  // Auto-progress
  useEffect(() => {
    setProgress(0);

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setTimeout(() => handleNext(), 0);
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(intervalRef.current);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex(prev => {
      if (prev < stories.length - 1) return prev + 1;
      onClose();
      return prev;
    });
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleDelete = async () => {
    if (!onDelete || !currentStory) return;

    try {
      await onDelete(currentStory.id);
      if (stories.length === 1) onClose();
      else if (currentIndex === stories.length - 1) setCurrentIndex(prev => prev - 1);
    } catch (err) {
      console.error(err);
      alert("Failed to delete story");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center">
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={onClose}
      >
        X
      </button>

      {/* Progress bars */}
      <div className="absolute top-2 left-0 w-full flex space-x-1 px-2">
        {stories.map((_, idx) => (
          <div
            key={idx}
            className="bg-white h-1 rounded"
            style={{
              flex: 1,
              opacity: idx === currentIndex ? 1 : 0.5,
              transform:
                idx === currentIndex ? `scaleX(${progress / 100})` : "scaleX(1)",
              transformOrigin: "left",
              transition: "transform 50ms linear",
            }}
          />
        ))}
      </div>

      {/* Story Image */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="text-white text-2xl"
        >
          ◀
        </button>

        <img
          src={currentStory.img ? `http://localhost:8800${currentStory.img}` : "/default-story.png"}
          alt={currentStory.username}
          className="max-h-[80vh] object-contain"
        />

        <button
          onClick={handleNext}
          disabled={currentIndex === stories.length - 1}
          className="text-white text-2xl"
        >
          ▶
        </button>
      </div>

      {/* Delete button */}
      {currentStory.userId === currentUser.id && (
        <button
          onClick={handleDelete}
          className="mt-4 btn btn-error text-white bg-red-600 px-4 py-2 rounded"
        >
          Delete Story
        </button>
      )}

      <p className="text-white mt-2">{currentStory.username}</p>
    </div>
  );
};

export default StoryViewer;
