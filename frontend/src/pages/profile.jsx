import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import { makeRequest } from "../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import Posts from "../components/Posts";
import Update from "../components/update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const handleUpdate = () => setOpenUpdate(prev => !prev);

  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch user data
  const { isLoading, data: userData } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => makeRequest.get("/users/find/" + userId).then(res => res.data),
  });

  // Fetch followers
  const { data: followersData } = useQuery({
    queryKey: ["followers", userId],
    queryFn: () => makeRequest.get("/relationships/followers?followedUserId=" + userId).then(res => res.data),
  });

  // Follow/unfollow mutation
  const mutation = useMutation({
    mutationFn: async (isFollowing) => {
      if (isFollowing) {
        await makeRequest.delete("/relationships", { data: { userId: currentUser.id, followedUserId: userId } });
      } else {
        await makeRequest.post("/relationships", { userId: currentUser.id, followedUserId: userId });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["followers", userId] }),
  });

  const handleFollow = () => {
    mutation.mutate(followersData?.includes(currentUser.id));
  };

  if (isLoading) return <div>Loading...</div>;
  if (!userData) return <div>User not found</div>;

  return (
    <div>
      {/* Profile Info */}
      <div className="container mx-auto p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">{userData.username}</h2>
            <p className="text-gray-700">{userData.name}</p>
            <p className="text-gray-600">{userData.bio}</p>
            {userData.instagram && (
              <p>
                Instagram:{" "}
                <a
                  href={userData.instagram.startsWith("http") ? userData.instagram : `https://${userData.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {userData.instagram}
                </a>
              </p>
            )}
            {userData.website && (
              <p>
                Website:{" "}
                <a
                  href={userData.website.startsWith("http") ? userData.website : `https://${userData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {userData.website}
                </a>
              </p>
            )}
          </div>

          {/* Buttons */}
          <div>
            {userData.id === currentUser.id ? (
              <button className="btn btn-primary" onClick={handleUpdate}>
                Edit Profile
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleFollow}>
                {followersData?.includes(currentUser.id) ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex space-x-2 mb-4">
          {userData.facebook && (
            <a href={userData.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              <FacebookIcon />
            </a>
          )}
          {userData.instagram && (
            <a href={userData.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              <InstagramIcon />
            </a>
          )}
          {userData.X && (
            <a href={userData.X} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              <XIcon />
            </a>
          )}
        </div>
      </div>

      {/* User Posts */}
      <Posts userId={userId} />

      {/* Update Modal */}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={userData} />}
    </div>
  );
};

export default Profile;
