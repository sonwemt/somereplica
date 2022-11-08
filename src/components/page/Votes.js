function Votes({post, upvote, downvote, isComment = -1}) {
  return <div className="vote-display">
    <button onClick={() => upvote(post.index, isComment)}>UP</button>
    <div className="vote-score">
    {
    isComment < 0 ? 
    post.votes.up - post.votes.down: 
    post.comments[isComment.index].votes.up - post.comments[isComment.index].votes.down
    }
    </div>
    <button onClick={() => {downvote(post.index, isComment)}}>DOWN</button>
  </div>
}

export { Votes };