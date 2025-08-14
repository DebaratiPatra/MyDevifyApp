import { useState } from "react";
import { makeRequest } from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// eslint-disable-next-line react/prop-types
const AddStory = ({ setAddStory, currentUser }) => {
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();

  // Mutation to upload story file directly to /stories
  const mutation = useMutation({
    mutationFn: (formData) =>
      makeRequest.post("/stories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      setAddStory(false);
    },
    onError: (err) => {
      console.error("Failed to add story:", err.response?.data || err);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("file", file);

    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <div>
          <h1 className="text-5xl font-bold mb-4">Add a Story</h1>
          <form className="w-full max-w-lg" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block uppercase tracking-wide text-xs font-bold mb-2">
                Story Image
              </label>
              <input
                type="file"
                className="input input-bordered w-full"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="btn btn-primary">
                Upload Story
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setAddStory(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStory;
