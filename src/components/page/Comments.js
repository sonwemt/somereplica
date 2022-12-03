import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { SubmitComment } from "./SubmitComment";
import { Comment } from "./Comment";
import '../../styles/comments.css';
import { PostCard } from "./PostCard";
import { db } from '../firebase';
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

function Comments({ addComment, upvote, downvote, isLoggedIn}) {
  const { postid } = useParams();
  const { subid } = useParams();
  const [currentPost, setCurrentPost] = useState(false);
  const [comments, setComments] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [updateRequest, setUpdateRequest] = useState(false);

  const passComment = async (postid, subid, commentInput) => {
    await addComment(postid, subid, commentInput);
    setUpdateRequest(true);
  }

  useEffect(() => {
    const getPost = async () => {
      const postRef = doc(db, 'posts', `${postid}`)
      const postSnap = await getDoc(postRef);
      if(postSnap.exists()) {
        console.log('idmatch')
        setCurrentPost({
          title: postSnap.data().title,
          content: postSnap.data().content,
          id: postSnap.id,
          linkExternal: postSnap.data().linkExternal,
          subreplica: postSnap.data().subreplica,
          votes: postSnap.data().votes,
          user: postSnap.data().user,
        });
        let tempArray = [];
        const commentsRef = collection(db, 'posts', postid, 'comments');
        const commentsSnap = await getDocs(commentsRef)
        commentsSnap.forEach((snap) => {
          tempArray.push({
            username: snap.data().username,
            comment: snap.data().comment,
            votes: snap.data().votes,
            id: snap.id,
            postid: snap.data().postid,
            subreplica: snap.data().subreplica,
          })
          setComments(tempArray);
        })

      } else {
        setInvalidLink(true);
        console.log('comments invalid')
      }
    }
    if(!invalidLink || updateRequest) {
      setUpdateRequest(false);
      getPost();
    }
  }, [postid, invalidLink, updateRequest])

  useEffect(() => {
    console.log('update');
  }, [addComment, isLoggedIn, postid, currentPost])

  return <div className="commentsContainer">{
    currentPost ? 
    <>
      <div className="postcard">
        <PostCard post={currentPost} upvote={upvote} downvote={downvote} detailed={true}></PostCard>
      </div>
      <SubmitComment passComment={passComment} postid={postid} subid={subid} isLoggedIn={isLoggedIn} />
       <ul className="comment-list">
       {comments ?
        comments.map((comment) => {
          return <li key={comment.id} className="comment-item">
            <Comment comment={comment} upvote={upvote} downvote={downvote}/>
          </li>;
        }): 
        <div>No comments yet</div>}
      </ul>
    </>: 
    invalidLink ? 
    <Navigate to='/page-does-not-exist'></Navigate>:
    <div>Loading</div>
  }</div>
}

export { Comments };