import { Link } from "react-router-dom";

function Comment({comment}) {
  return <div className="commentContainer">
    <Link to={`/u/${comment.username}/`}>
      <div>{comment.username}</div>
    </Link>
    <div>{comment.comment}</div>
    <Link to={`/r/${comment.subreplica}/comments/${comment.postid}`}>comments</Link>
  </div>
}

export { Comment };