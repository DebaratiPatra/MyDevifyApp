import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeRequest } from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Update = ({ setOpenUpdate, user }) => {
  const [profile, setProfile] = useState(null);
  const [cover, setCover] = useState(null);
  const [info, setInfo] = useState({
    username: user.username,
    name: user.name || "",
    email: user.email,
    bio: user.bio || "",
    instagram: user.instagram || "",
    website: user.website || "",
  });

  const [previewProfile, setPreviewProfile] = useState(
    user.profilePic ? `http://localhost:8800/images/${user.profilePic}` : null
  );
  const [previewCover, setPreviewCover] = useState(
    user.coverPic ? `http://localhost:8800/images/${user.coverPic}` : null
  );

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data; // returns filename
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (updatedUser) => makeRequest.put("/users", updatedUser),
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ["user", user.id] });
    setOpenUpdate(false);
  },
  onError: (err) => {
      console.error("Update failed:", err.response?.data || err);
    },
});
  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedProfilePic = user.profilePic;
    let updatedCoverPic = user.coverPic;

    if (profile) updatedProfilePic = await upload(profile);
    if (cover) updatedCoverPic = await upload(cover);

    mutation.mutate({
      username: info.username,
      name: info.name,
      email: info.email,
      bio: info.bio,
      instagram: info.instagram,
      website: info.website,
      profilePic: updatedProfilePic,
      coverPic: updatedCoverPic,
    });
  };

  useEffect(() => {
    if (profile) setPreviewProfile(URL.createObjectURL(profile));
  }, [profile]);

  useEffect(() => {
    if (cover) setPreviewCover(URL.createObjectURL(cover));
  }, [cover]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-200">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Update Your Profile</h1>

        {/* Live preview */}
        <div className="mb-4 flex space-x-4">
          {previewCover && (
            <img
              src={previewCover}
              alt="Cover Preview"
              className="w-48 h-24 object-cover rounded"
            />
          )}
          {previewProfile && (
            <img
              src={previewProfile}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={info.name}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="mb-2">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={info.username}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="mb-2">
            <label>Bio</label>
            <input
              type="text"
              name="bio"
              value={info.bio}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="mb-2">
            <label>Instagram</label>
            <input
              type="text"
              name="instagram"
              value={info.instagram}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="mb-2">
            <label>Website</label>
            <input
              type="text"
              name="website"
              value={info.website}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="mb-2">
            <label>Profile Picture</label>
            <input type="file" onChange={(e) => setProfile(e.target.files[0])} />
          </div>

          <div className="mb-4">
            <label>Cover Picture</label>
            <input type="file" onChange={(e) => setCover(e.target.files[0])} />
          </div>

          <div className="flex space-x-2">
            <button type="submit" className="btn btn-primary">
              Update
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setOpenUpdate(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Update.propTypes = {
  setOpenUpdate: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Update;
