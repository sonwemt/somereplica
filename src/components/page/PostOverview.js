import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/postoverview.css";
import { PostCard } from "./PostCard";

function PostOverview({posts, upvote, downvote, isLoggedIn, updatePosts}) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const updateInfo = async () => {
      await updatePosts();
      setIsLoading(false);
    }
    if(isLoading){
      updateInfo();
    }
  }, [isLoading, setIsLoading, updatePosts])

  return (
  <div id="PostContainer">
   {isLoggedIn ?
     <Link to="/submitpost" className="submit-link">
      Submit
    </Link> : 
    <div>Log in or sign up to submit posts</div>
    }
    <ul className="post-list">
      {posts.map((post) => {
        return (
          <PostCard key={post.id} post={post} upvote={upvote} downvote={downvote} isLoggedIn={isLoggedIn}/>
        );
      })}
    </ul>
  </div>
  )
}

export { PostOverview };