import { Link } from "react-router-dom";
import { Votes } from "./Votes";
import '../../styles/postcard.css';

function PostCard({post, isLoggedIn, detailed = false}) {
  return (
  <li className="post-item">
    <Votes postid={post.id} isLoggedIn={isLoggedIn} votes={post.votes} />
    <div className="post-content">
      {
      post.linkExternal ? <a href={`${post.content}`}>{post.title}</a> :
      <>
      <Link to={`/r/${post.subreplica}/comments/${post.id}`} >
        <div>{post.title}</div>
      </Link>
      </>
      }
    </div>
    <div className="post-info">
      <Link to={`/r/${post.subreplica}`}>
          <div>/r/{post.subreplica}</div>
        </Link>
        <Link to={`/u/${post.user}/`}>
          <div>/u/{post.user}</div>
        </Link>
    </div>
    {detailed && !post.linkExternal?
      <div className="self-text">{post.content}</div>: 
      null}
    <div className="post-interactions">
      <Link to={`/r/${post.subreplica}/comments/${post.id}`}  >
        <div className="comment-link">comments</div>
      </Link>
      <div>share</div>
      <div>save</div>
      <div>...</div>
    </div>
  </li>
  );
}

export { PostCard };