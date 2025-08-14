import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { AuthContext } from "../context/AuthContext";

const OtherUserProfile = ({ user }) => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch relationship status
  const { data: isFollowing } = useQuery({
    queryKey: ["relationship", user.id],
    queryFn: () =>
      makeRequest
        .get(`/relationships?followedUserId=${user.id}`)
        .then((res) => res.data.includes(currentUser.id)),
  });

  // Mutation for follow/unfollow
  const mutation = useMutation({
    mutationFn: () =>
      isFollowing
        ? makeRequest.delete(`/relationships?userId=${user.id}`)
        : makeRequest.post(`/relationships`, { userId: user.id }),
    onSuccess: () => queryClient.invalidateQueries(["relationship", user.id]),
  });

  const handleFollowToggle = () => {
    mutation.mutate();
  };

  return (
    <div className="card p-4 shadow-lg mb-2">
      <p className="font-bold">{user.username}</p>
      <p>{user.name}</p>
      {currentUser.id !== user.id && (
        <button
          className="btn btn-sm mt-2"
          onClick={handleFollowToggle}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default OtherUserProfile;
