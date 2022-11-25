import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { SubmitComment } from "./SubmitComment";
import { Comment } from "./Comment";
import '../../styles/comments.css';
import { Votes } from "./Votes";
import { PostCard } from "./PostCard";
import db from '../firebase';
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

function Comments({ addComment, upvote, downvote, isLoggedIn}) {
  const { id } = useParams();
  const [currentPost, setCurrentPost] = useState(false);
  const [comments, setComments] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [updateRequest, setUpdateRequest] = useState(false);

  const handleAddComment = async (postId, commentInput) => {
    await addComment(postId, commentInput);
    setUpdateRequest(true);
  }

  const handleUpvote = async (postid, isComment) => {
    await upvote(postid, isComment);
    setUpdateRequest(true);
  }

  const handleDownvote = async (postid, isComment) => {
    await downvote(postid, isComment);
    setUpdateRequest(true);
  }

  useEffect(() => {
    console.log(id);
    const getPost = async () => {
      const postRef = doc(db, 'posts', `${id}`)
      const postSnap = await getDoc(postRef);
      if(postSnap.exists()) {
        console.log('idmatch')
        setCurrentPost({
          title: postSnap.data().title,
          content: postSnap.data().content,
          id: postSnap.id,
          linkExternal: postSnap.data().linkExternal,
          votes: postSnap.data().votes,
        });
        let tempArray = [];
        const commentsRef = collection(db, 'posts', id, 'comments');
        const commentsSnap = await getDocs(commentsRef)
        commentsSnap.forEach((snap) => {
          tempArray.push({
            username: snap.data().username,
            comment: snap.data().comment,
            votes: snap.data().votes,
            id: snap.id,
          })
        })
        setComments(tempArray);
      } else {
        setInvalidLink(true);
      }
    }
    if(!invalidLink || updateRequest) {
      setUpdateRequest(false);
      getPost();
    }
  }, [id, invalidLink, updateRequest])

  useEffect(() => {
    console.log('update');
  }, [addComment, isLoggedIn, id, currentPost])

  return <div className="commentsContainer">{
    currentPost ? 
    <>
      <div className="postcard">
        <PostCard post={currentPost} upvote={handleUpvote} downvote={handleDownvote} detailed={true}></PostCard>
      </div>
      <SubmitComment addComment={handleAddComment} postId={id} isLoggedIn={isLoggedIn} />
       <ul className="comment-list">
       {comments ?
        comments.map((comment) => {
          return <li key={comment.id} className="comment-item">
            <Votes postid={id} votes={comment.votes} upvote={handleUpvote} downvote={handleDownvote} isComment={comment.id} setUpdateRequest={setUpdateRequest}></Votes>
            <Comment comment={comment}/>
          </li>;
        }): 
        <div>Loading comments</div>}
      </ul>
    </>: 
    invalidLink ? 
    <Navigate to='/page-does-not-exist'></Navigate>:
    <div>Loading</div>
  }</div>
}

export { Comments };