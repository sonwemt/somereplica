import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SubmitComment } from "./SubmitComment";
import { Comment } from "./Comment";
import '../../styles/comments.css';
import { Votes } from "./Votes";
import { PostCard } from "./PostCard";

function Comments({posts, addComment, upvote, downvote}) {
  const { id } = useLocation().state;
  const [currentPost, setCurrentPost] = useState(false);

  useEffect(() => {
    const post = posts.find((post) => {
      return post.id === id;
    });
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
    </>: null}
  </div>
}

export { Comments };