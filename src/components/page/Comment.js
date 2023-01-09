import { Link, useNavigate } from "react-router-dom";
import { Votes } from "./Votes";
import '../../styles/comment.css';
import { deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { TimeElapsed } from "./TimeElapsed";
import { useState } from "react";
import { SubmitComment } from "./SubmitComment";

function Comment({comment, isLoggedIn, isReference = false}) {
  const navigate = useNavigate();
  const [showReplyBox, setShowReplyBox] = useState(false);
  
  const handleRemoveAction = async () => {
    try {
      await deleteDoc(doc(db, 'posts', `${comment.parentid}`, 'comments', `${comment.id}`))
      navigate(0);
    } catch(error) {
      console.log(error);
    }
  }

  // https://stackoverflow.com/a/36829986
  const nestedComments = (comment.children || []).map(comment => {
    return <Comment key={comment.id} comment={comment} isLoggedIn={isLoggedIn}/>;
  });

  return <div className="threadContainer">
    <div className="commentContainer">
    <Votes postid={comment.parentid} votes={comment.votes} isLoggedIn={isLoggedIn} isComment={comment.id}></Votes>
    <Link to={`/u/${comment.user}/`} className="comment-username">
      <div>{comment.user}</div>
    </Link>
    <div className="comment-content">{comment.comment}</div>
    
    <div className="comment-options">
      {isLoggedIn.displayName === comment.user ?
      <div onClick={() => handleRemoveAction()} style={{color:'gray'}}>remove</div>: 
      null
      }
      <div style={{color:'gray'}}>save</div>
      <div onClick={() => setShowReplyBox(showReplyBox ? false : true)}>reply</div>
      <TimeElapsed created={comment.localDate} />
      {
      isReference? 
      <Link to={`/r/${comment.subreplica}/comments/${comment.parentid}`}>context</Link>:
      null
      }
    </div>
    {showReplyBox ? <SubmitComment subid={comment.subreplica} postid={comment.parentid} isLoggedIn={isLoggedIn} isReply={comment}/>: null}
    </div>
    <div className="childContainer">{nestedComments}</div>
  </div>
}

export { Comment };