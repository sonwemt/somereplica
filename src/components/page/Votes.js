function Votes({votes}) {
  return <div className="vote-display">
    <button>UP</button>
    <div className="vote-score">{votes.up + votes.down}</div>
    <button>DOWN</button>
  </div>
}

export { Votes };