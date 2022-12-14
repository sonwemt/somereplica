import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { SubmitComment } from "./SubmitComment";
import { Comment } from "./Comment";
import '../../styles/comments.css';
import { PostCard } from "./PostCard";
import { db } from '../firebase';
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

function Comments({ isLoggedIn }) {
  const { postid } = useParams();
  const { subid } = useParams();
  const [currentPost, setCurrentPost] = useState(false);
  const [comments, setComments] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [updateRequest, setUpdateRequest] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      const postRef = doc(db, 'posts', `${postid}`)
      const postSnap = await getDoc(postRef);
      if(postSnap.exists()) {
        console.log('idmatch')
        setCurrentPost({
          id: postSnap.id,
          ...postSnap.data()
        });
        let tempArray = [];
        const commentsRef = collection(db, 'posts', postid, 'comments');
        const commentsSnap = await getDocs(commentsRef)
        commentsSnap.forEach((commentSnap) => {
          tempArray.push({
            id: commentSnap.id,
            ...commentSnap.data()
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
  }, [isLoggedIn, postid, currentPost])

  return <div className="commentsContainer">{
    currentPost ? 
    <>
      <div className="postcard">
        <PostCard post={currentPost} isLoggedIn={isLoggedIn} detailed={true}></PostCard>
      </div>
      <SubmitComment postid={postid} subid={subid} isLoggedIn={isLoggedIn} />
       <ul className="comment-list">
       {comments ?
        comments.map((comment) => {
          return <li key={comment.id} className="comment-item">
            <Comment comment={comment} isLoggedIn={isLoggedIn}/>
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