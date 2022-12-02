function Votes({postid, votes, upvote, downvote, isComment = false}) {
  return <div className="vote-display">
    <button onClick={() => {upvote(postid, isComment)}}>UP</button>
    <div className="vote-score">
    {
    votes.up - votes.down
    }
    </div>
    <button onClick={() => {downvote(postid, isComment)}}>DOWN</button>
  </div>
}

export { Votes };