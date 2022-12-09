import { Link } from "react-router-dom";
import { Votes } from "./Votes";
import '../../styles/comment.css';

function Comment({comment, isLoggedIn, isReference = false}) {
  return <div className="commentContainer">
    <Votes postid={comment.postid} votes={comment.votes} isLoggedIn={isLoggedIn} isComment={comment.id}></Votes>
    <Link to={`/u/${comment.user}/`} className="comment-username">
      <div>{comment.user}</div>
    </Link>
    <div className="comment-content">{comment.comment}</div>
    {
      isReference? 
      <Link to={`/r/${comment.subreplica}/comments/${comment.postid}`}>context</Link>:
      null
    }
  </div>
}

export { Comment };