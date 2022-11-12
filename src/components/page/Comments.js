import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { SubmitComment } from "./SubmitComment";
import { Comment } from "./Comment";
import '../../styles/comments.css';
import { Votes } from "./Votes";
import { PostCard } from "./PostCard";

function Comments({posts, addComment, upvote, downvote}) {
  const { id } = useParams();
  const [currentPost, setCurrentPost] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  useEffect(() => {
    const post = posts.find((post) => {
      return post.id === id;
    });
    if(post === undefined) {
      setInvalidLink(true);
    }
    setCurrentPost(post);
  }, [currentPost, setCurrentPost, id, posts])

  return <div className="commentsContainer">
    {currentPost ? 
    <>
      <div id="post-card-comments">
        <PostCard post={currentPost} upvote={upvote} downvote={downvote}></PostCard>
      </div>
      <SubmitComment addComment={addComment} postId={id}/>
      <ul className="comment-list">
        {currentPost.comments.map((comment) => {
          return <li key={comment.id} className="comment-item">
            <Votes post={currentPost} upvote={upvote} downvote={downvote} isComment={comment}></Votes>
            <Comment comment={comment}/>
          </li>;
        })}
      </ul>
    </>: invalidLink ? <Navigate to='/page-does-not-exist'></Navigate>: <div>Loading</div>}
  </div>
}

export { Comments };