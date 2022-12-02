import { useState } from "react";

function Votes({postid, votes, upvote, downvote, isComment = false}) {
  const [localVotes, setLocalVotes] = useState(votes);

  const handleUpvote = () => {
    upvote(postid, isComment);
    setLocalVotes({up: localVotes.up + 1, down: localVotes.down})
  }

  const handleDownvote = () => {
    downvote(postid, isComment);
    setLocalVotes({up: localVotes.up, down: localVotes.down + 1})
  }

  return <div className="vote-display">
    <button onClick={handleUpvote}>UP</button>
    <div className="vote-score">
    {
    localVotes.up - localVotes.down
    }
    </div>
    <button onClick={handleDownvote}>DOWN</button>
  </div>
}

export { Votes };