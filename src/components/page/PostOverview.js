import { Link } from "react-router-dom";
import "../../styles/postoverview.css";
import { PostCard } from "./PostCard";

function PostOverview({posts, upvote, downvote, isLoggedIn}) {
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
          <li className="post-item" key={post.id}>
             <PostCard post={post} upvote={upvote} downvote={downvote}/>
          </li>
        );
      })}
    </ul>
  </div>
  )
}

export { PostOverview };