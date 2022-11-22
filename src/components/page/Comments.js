import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { SubmitComment } from "./SubmitComment";
import { Comment } from "./Comment";
import '../../styles/comments.css';
import { Votes } from "./Votes";
import { PostCard } from "./PostCard";
import db from '../firebase';
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

function Comments({ addComment, upvote, downvote, isLoggedIn, updatePosts}) {
  const { id } = useParams();
  const [currentPost, setCurrentPost] = useState(false);
  const [comments, setComments] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  useEffect(() => {
    console.log('update');
  }, [addComment, updatePosts, upvote, downvote, isLoggedIn, id, currentPost])

  useEffect(() => {
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
    if(!invalidLink) {
      getPost();
    }
  }, [updatePosts, id, invalidLink])

  return <div className="commentsContainer">
    {currentPost ? 
    <>
      <div className="postcard">
        <PostCard post={currentPost} upvote={upvote} downvote={downvote}></PostCard>
      </div>
      <SubmitComment addComment={addComment} postId={id} isLoggedIn={isLoggedIn} />
       <ul className="comment-list">
       {comments ?
        comments.map((comment) => {
          return <li key={comment.id} className="comment-item">
            <Votes postid={id} votes={comment.votes} upvote={upvote} downvote={downvote} isComment={comment.id}></Votes>
            <Comment comment={comment}/>
          </li>;
        }): <div>Loading comments</div>}
      </ul>
    </>: invalidLink ? <Navigate to='/page-does-not-exist'></Navigate>: <div>Loading</div>}
  </div>
}

export { Comments };