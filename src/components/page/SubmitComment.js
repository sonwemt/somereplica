import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/submitcomment.css';
import { db } from "../firebaseConfig";

function SubmitComment({postid, subid, isLoggedIn, isReply = false}) {
  const [commentInput, setCommentInput] = useState('');
  const navigate = useNavigate();

  const addComment = async () => {
    try {
      const postsRef = collection(db, 'posts')
      const commentRef = await addDoc(collection(postsRef, `${postid}`, 'comments'), {
        user: isLoggedIn.displayName,
        uid: isLoggedIn.uid,
        comment: commentInput,
        votes: {
          up: 1,
          down: 0,
        },
        score: 1,
        subreplica: subid,
        postid: postid,
        commentType: [
          isReply? 'reply' : 'top',
          isReply && isReply.commentType[1] === null ?
          isReply.id : 
          isReply && isReply.commentType[1] !== null ?
          isReply.commentType[1] :
          null
        ],
        isReplyToID: isReply ? isReply.id: false,
        nestLevel: isReply ? isReply.nestLevel + 1: null,
        created: serverTimestamp(),
      });
      await setDoc(doc(db, 'users', `${isLoggedIn.uid}`, 'votes', `${commentRef.id}`), {
        vote: 'up',
      })
      setCommentInput('');
      navigate(0);
      console.log("Document written with ID: ", commentRef.id);
    } catch (e) {
      console.error("Error adding comment", e)
    }
  }

  const prepareComment = (e) => {
    e.preventDefault();
    addComment();
  }

  return <form noValidate className="comment-form" onSubmit={(e) => prepareComment(e)}>
    {
    isLoggedIn ?
    <>
      <textarea type="text" placeholder="Comment" value={commentInput} onChange={(e) => {setCommentInput(e.target.value)}} maxLength="500" rows="4" cols="50" style={{resize: "none"}}></textarea>
      <button type="submit">Submit</button>
    </>:
    <>
      <textarea type="text" placeholder="Comment" disabled={true} rows="4" cols="50" style={{resize: "none"}}></textarea>
      <div>You need to be logged in to post a comment</div>
    </>
    }
  </form>
}

export { SubmitComment };