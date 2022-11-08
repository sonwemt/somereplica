import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SubmitComment } from "./SubmitComment";
import { Comment } from "./Comment";
import '../../styles/comments.css';

function Comments({posts, addComment}) {
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
      <div className="postInfo">
        {
        currentPost.linkExternal ? 
        <a href={currentPost.content}>{currentPost.content}</a>:
        <>
          <div className="postTitle">{currentPost.title}</div>
          <div className="postContent">{currentPost.content}</div>
        </>
        }
      </div>
      <SubmitComment addComment={addComment} postId={id}/>
      <ul>
        {currentPost.comments.map((comment) => {
          return <li key={comment.id}>
            <Comment comment={comment}/>
          </li>;
        })}
      </ul>
    </>: null}
  </div>
}

export { Comments };