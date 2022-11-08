import { Link } from "react-router-dom";
import "../../styles/postoverview.css";
import { Votes } from "./Votes";

function PostOverview({posts, upvote, downvote}) {
  return (
  <div id="PostContainer">
    <Link to="/submitpost" ><button>submit</button></Link>
    <ul className="postOverview">
      {posts.map((post) => {
        return (
        <li key={post.id}>
          <Votes post={post} upvote={upvote} downvote={downvote} />
          {
          post.linkExternal ? <a href={`${post.content}`}>{post.title}</a> :
          <Link to={`/${post.id}`} state={{id: post.id}} >
            <div>{post.title}</div>
          </Link>
          }
          <Link to={`/${post.id}`} state={{id: post.id}} >
            <div className="comment-link">comments</div>
          </Link>
          </li>
        )
      })}
    </ul>
  </div>
  )
}

export { PostOverview };