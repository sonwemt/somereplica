function Comment({comment}) {
  return <div className="commentContainer">
    <div>{comment.username}</div>
    <div>{comment.comment}</div>
  </div>
}

export { Comment };