import Stories from "../components/Stories";
import Share from "../components/Share";
import Posts from "../components/Posts";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Stories */}
      <Stories />

      {/* Post creation form */}
      <Share />

      {/* Posts feed (exclude current user's posts) */}
      <Posts excludeUserId={currentUser.id} />
    </div>
  );
};

export default Home;



// import Posts from "../components/Posts"
// import Share from "../components/Share"
// import Stories from "../components/Stories"


// const home = () => {
//   return (
//     <div className="place-items-center">  {/* it had grid  class */}
    
//     <Stories />
//     <Share/>
//     <Posts component={(props) => <Posts userId={props.match.params.userId} />}/>

//     </div>
//   )
// }

// export default home