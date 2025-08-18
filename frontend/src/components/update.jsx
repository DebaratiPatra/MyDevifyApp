import { useState } from "react";
import PropTypes from "prop-types";
import { makeRequest } from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Update = ({ setOpenUpdate, user }) => {
  const [info, setInfo] = useState({
    username: user.username,
    name: user.name || "",
    email: user.email,
    bio: user.bio || "",
    instagram: user.instagram || "",
    website: user.website || "",
  });

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedUser) => makeRequest.put("/users", updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      setOpenUpdate(false);
    },
    onError: (err) => {
      console.error("Update failed:", err.response?.data || err);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(info);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-200">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Update Your Profile</h1>

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

          <div className="flex space-x-2 mt-4">
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
