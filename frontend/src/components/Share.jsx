import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";

const Share = () => {
  const { currentUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const queryClient = useQueryClient();

  // Function to upload file and return filename
  const upload = async () => {
    if (!file) return "";
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      console.log("Upload response:", res.data);
      return res.data; // Ensure backend returns the uploaded filename
    } catch (err) {
      console.error("File upload failed:", err);
      return "";
    }
  };

  // Mutation to create a post
  const mutation = useMutation({
    mutationFn: (newPost) => makeRequest.post("/posts", newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setDesc("");
      setFile(null);
    },
    onError: (err) => {
      console.error("Post creation failed:", err);
      alert("Failed to create post. Please try again.");
    },
  });

  const handleShare = async (e) => {
    e.preventDefault();

    if (!desc && !file) return; // Do not submit empty post

    const imgUrl = await upload();

    const postData = {
      userId: currentUser.id, // Include userId for backend
      desc,
      img: imgUrl,
    };

    console.log("Submitting post:", postData);
    mutation.mutate(postData);
  };

  return (
    <div className="p-4 bg-base-100 shadow-xl rounded-md">
      <div className="flex items-center space-x-4">
        <div className="w-10 mb-3 avatar">
          <img
            alt=""
            className="rounded-full"
            src={
              currentUser.profilePic
                ? `http://localhost:5173/uploads/posts/${currentUser.profilePic}`
                : "http://localhost:5173/default/default_profile.png"
            }
          />
        </div>
        <span className="font-bold">{currentUser.name}</span>
      </div>

      <textarea
        placeholder={`What's on your mind, ${currentUser.name}?`}
        className="w-full h-32 p-2 my-4 border border-gray-300 rounded-md"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <label
        htmlFor="imageInput"
        className="flex items-center space-x-2 cursor-pointer text-blue-500"
      >
        <FontAwesomeIcon icon={faImage} />
        <span>Add Image</span>
      </label>

      <input
        id="imageInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {file && (
        <div className="my-2">
          <img
            src={URL.createObjectURL(file)}
            alt="Selected"
            className="max-w-full h-auto rounded-md"
          />
        </div>
      )}

      <button
        className={`bg-blue-500 text-white py-2 px-4 rounded-md ${
          !desc && !file ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleShare}
        disabled={!desc && !file}
      >
        <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
        Share
      </button>
    </div>
  );
};

export default Share;
