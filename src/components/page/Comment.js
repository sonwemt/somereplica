import { Link, useNavigate } from "react-router-dom";
import { Votes } from "./Votes";
import '../../styles/comment.css';
import { deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig';

function Comment({comment, isLoggedIn, isReference = false}) {
  const navigate = useNavigate();
  
  const handleRemoveAction = async () => {
    try {
      await deleteDoc(doc(db, 'posts', `${comment.parentid}`, 'comments', `${comment.id}`))
      navigate(0);
    } catch(error) {
      console.log(error);
    }
  }

  return <div className="commentContainer">
    <Votes postid={comment.parentid} votes={comment.votes} isLoggedIn={isLoggedIn} isComment={comment.id}></Votes>
    <Link to={`/u/${comment.user}/`} className="comment-username">
      <div>{comment.user}</div>
    </Link>
    <div className="comment-content">{comment.comment}</div>
    
    <div className="comment-options">
      {isLoggedIn.displayName === comment.user ?
      <div onClick={() => handleRemoveAction()}>remove</div>: 
      null
      }
      <div>save</div>
      {
      isReference? 
      <Link to={`/r/${comment.subreplica}/comments/${comment.parentid}`}>context</Link>:
      null
      }
    </div>
  </div>
}

export { Comment };