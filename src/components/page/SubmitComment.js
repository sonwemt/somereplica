import { useState } from "react";

function SubmitComment({postId, addComment}) {
  const [commentInput, setCommentInput] = useState('');

  const prepareComment = (e) => {
    e.preventDefault();
    addComment(postId, commentInput);
  }

  return <form noValidate onSubmit={(e) => prepareComment(e)}>
    <input type="text" placeholder="Comment" value={commentInput} onChange={(e) => {setCommentInput(e.target.value)}}></input>
    <button type="submit">Submit</button>
  </form>
}

export { SubmitComment };