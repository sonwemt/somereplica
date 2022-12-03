import { Link } from "react-router-dom";
import { Votes } from "./Votes";

function Comment({comment, upvote, downvote}) {
  return <div className="commentContainer">
    <Votes postid={comment.postid} votes={comment.votes} upvote={upvote} downvote={downvote} isComment={comment.id}></Votes>
    <Link to={`/u/${comment.username}/`}>
      <div>{comment.username}</div>
    </Link>
    <div>{comment.comment}</div>
    <Link to={`/r/${comment.subreplica}/comments/${comment.postid}`}>comments</Link>
  </div>
}

export { Comment };