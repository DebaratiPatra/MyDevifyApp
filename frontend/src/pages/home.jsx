import Stories from "../components/Stories";
import Share from "../components/Share";
import Posts from "../components/Posts";

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Stories */}
      <Stories />

      {/* Post creation form */}
      <Share />

      {/* Posts feed (all posts for home) */}
      <Posts /> {/* no userId passed → fetch all posts */}
    </div>
  );
};

export default Home;