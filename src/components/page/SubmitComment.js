import { useState } from "react";
import '../../styles/submitcomment.css';

function SubmitComment({postid, passComment, subid, isLoggedIn}) {
  const [commentInput, setCommentInput] = useState('');

  const prepareComment = (e) => {
    e.preventDefault();
    passComment(postid, subid,commentInput);
  }

  return <form noValidate className="comment-form" onSubmit={(e) => prepareComment(e)}>
    {
    isLoggedIn ?
    <>
    <textarea type="text" placeholder="Comment" value={commentInput} onChange={(e) => {setCommentInput(e.target.value)}} rows="4" cols="50" style={{resize: "none"}}></textarea>
    <button type="submit">Submit</button></>:
    <>
    <textarea type="text" placeholder="Comment" disabled={true} rows="4" cols="50" style={{resize: "none"}}></textarea>
    <div>You need to be logged in to post a comment</div>
    </>
    }
  </form>
}

export { SubmitComment };