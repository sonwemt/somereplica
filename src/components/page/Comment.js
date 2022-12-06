import { Link } from "react-router-dom";
import { Votes } from "./Votes";

function Comment({comment, isLoggedIn, isReference = false}) {
  return <div className="commentContainer">
    <Votes postid={comment.postid} votes={comment.votes} isLoggedIn={isLoggedIn} isComment={comment.id}></Votes>
    <Link to={`/u/${comment.username}/`}>
      <div>{comment.username}</div>
    </Link>
    <div>{comment.comment}</div>
    {
      isReference? 
      <Link to={`/r/${comment.subreplica}/comments/${comment.postid}`}>comments</Link>:
      null
    }
  </div>
}

export { Comment };