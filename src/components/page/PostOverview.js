import { Link } from "react-router-dom";
import "../../styles/postoverview.css";
import { PostCard } from "./PostCard";

function PostOverview({posts, upvote, downvote}) {
  return (
  <div id="PostContainer">
    <Link to="/submitpost" className="submit-link">
      Submit
    </Link>
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