function Votes({post, upvote, downvote, isComment = false}) {
  return <div className="vote-display">
    <button onClick={() => upvote(post.index, isComment)}>UP</button>
    <div className="vote-score">
    {
    !isComment ? 
    post.votes.up - post.votes.down: 
    post.comments[isComment].votes.up - post.comments[isComment].votes.down
    }
    </div>
    <button onClick={() => downvote(post.index, isComment)}>DOWN</button>
  </div>
}

export { Votes };