import { Link } from "react-router-dom";
import { Votes } from "./Votes";
import '../../styles/postcard.css';

function PostCard({post, upvote, downvote, detailed = false}) {
  return (
  <li className="post-item">
    <Votes postid={post.id} votes={post.votes} upvote={upvote} downvote={downvote} />
    <div className="post-item-content">
      {
      post.linkExternal ? <a href={`${post.content}`}>{post.title}</a> :
      <>
      <Link to={`/comments/${post.id}`} >
        <div>{post.title}</div>
      </Link>
      {detailed ?
      <div className="self-text">{post.content}</div>: 
      null}
      </>
      }
      <div className="post-interactions">
      <Link to={`/r/${post.subreplica}`}>
        <div>{post.subreplica}</div>
      </Link>
        <Link to={`/comments/${post.id}`}  >
          <div className="comment-link">comments</div>
        </Link>
        <div>share</div>
        <div>save</div>
        <div>...</div>
      </div>
    </div>
  </li>
  );
}

export { PostCard };