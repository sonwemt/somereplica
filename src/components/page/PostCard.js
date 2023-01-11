import { Link } from "react-router-dom";
import { Votes } from "./Votes";
import "../../styles/postcard.css";
import { db } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { TimeElapsed } from "./TimeElapsed";

function PostCard({ post, isLoggedIn, detailed = false }) {
  const [commentCount, setCommentCount] = useState(null);

  useEffect(() => {
    const getNumberOfComments = async () => {
      const commentsRef = collection(db, "posts", post.id, "comments");
      const count = await getCountFromServer(commentsRef);
      setCommentCount(count.data().count);
    };

    getNumberOfComments();
  }, [post, commentCount]);

  return (
    <li className="post-item">
      <Votes postid={post.id} isLoggedIn={isLoggedIn} votes={post.votes} />
      <div className="post-content">
        {post.linkExternal ? (
          <a href={`${post.content}`}>{post.title}</a>
        ) : (
          <>
            <Link to={`/r/${post.subreplica}/comments/${post.id}`}>
              <div>{post.title}</div>
            </Link>
          </>
        )}
      </div>
      <div className="post-info">
        <Link to={`/r/${post.subreplica}`}>
          <div>/r/{post.subreplica}</div>
        </Link>
        <Link to={`/u/${post.user}/`}>
          <div>/u/{post.user}</div>
        </Link>
        <TimeElapsed created={post.localDate} />
      </div>
      {detailed && !post.linkExternal ? (
        <div className="self-text">{post.content}</div>
      ) : null}
      <div className="post-interactions">
        <Link to={`/r/${post.subreplica}/comments/${post.id}`}>
          <div className="comment-link">{commentCount} comments</div>
        </Link>
        <div>share</div>
        <div>save</div>
        <div>...</div>
      </div>
    </li>
  );
}

export { PostCard };
