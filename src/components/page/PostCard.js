import { Link } from "react-router-dom";
import { Votes } from "./Votes";
import '../../styles/postcard.css';

function PostCard({post, upvote, downvote}) {
  return (
  <>
    <Votes post={post} upvote={upvote} downvote={downvote} />
    <div className="post-item-content">
      {
      post.linkExternal ? <a href={`${post.content}`}>{post.title}</a> :
      <Link to={`/comments/${post.id}`} >
        <div>{post.title}</div>
      </Link>
      }
      <div className="post-interactions">
        <Link to={`/comments/${post.id}`}  >
          <div className="comment-link">comments</div>
        </Link>
        <div>share</div>
        <div>save</div>
        <div>...</div>
      </div>
    </div>
  </>
  );
}

export { PostCard };