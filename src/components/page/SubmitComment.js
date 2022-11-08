import { useState } from "react";

function SubmitComment({postId, addComment}) {
  const [currentUser, setCurrentUser] = useState('');
  const [commentInput, setCommentInput] = useState('');

  const prepareComment = (e) => {
    e.preventDefault();
    addComment(postId, currentUser, commentInput);
  }

  return <form noValidate onSubmit={(e) => prepareComment(e)}>
    <input type="text" placeholder="Username" value={currentUser} onChange={(e) => {setCurrentUser(e.target.value)}}></input> 
    <input type="text" placeholder="Comment" value={commentInput} onChange={(e) => {setCommentInput(e.target.value)}}></input>
    <button type="submit">Submit</button>
  </form>
}

export { SubmitComment };