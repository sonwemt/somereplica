import {
  getDocs,
  collection,
  query,
  where,
  collectionGroup,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { Comment } from "./Comment";
import { PostCard } from "./PostCard";

function UserProfile({ isLoggedIn }) {
  const { userid } = useParams();
  const [userData, setUserData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState(0);
  const [userPosts, setUserPosts] = useState(false);
  const [userComments, setUserComments] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      console.log(userid);
      const userQuery = query(
        collection(db, "users"),
        where("displayName", "==", `${userid}`)
      );
      const userSnap = await getDocs(userQuery);
      if (!userSnap.empty) {
        console.log("exists");
        userSnap.forEach((doc) => {
          setUserData({
            id: doc.id,
            ...doc.data(),
          });
        });
      } else {
        setUserData(false);
      }
      setLoading(false);
    };
    if (loading || userData.displayName !== userid) {
      getUserData();
    }
  }, [loading, userData, userid]);

  useEffect(() => {
    const getUserPosts = async () => {
      let tempArray = [];
      const postQuery = query(
        collection(db, "posts"),
        where("user", "==", `${userData.displayName}`)
      );
      const postsSnap = await getDocs(postQuery);
      if (postsSnap.empty) {
        setUserPosts([]);
      }
      postsSnap.forEach((doc) => {
        console.log(doc.data().title);
        tempArray.push({
          id: doc.id,
          ...doc.data(),
        });
        setUserPosts(tempArray);
      });
    };
    if (!userPosts && userData) {
      getUserPosts();
    }
  }, [userData, userPosts]);

  useEffect(() => {
    console.log(selection);
    const getComments = async () => {
      let commentArray = [];
      const commentQuery = query(
        collectionGroup(db, "comments"),
        where("user", "==", `${userData.displayName}`)
      );
      const commentsSnap = await getDocs(commentQuery);
      if (commentsSnap.empty) {
        setUserComments([]);
        console.log("no comments fetched");
      }
      commentsSnap.forEach((doc) => {
        commentArray.push({
          id: doc.id,
          parentid: doc.ref.parent.parent.id,
          ...doc.data(),
        });
        setUserComments(commentArray);
      });
    };
    if (selection === 1 && userData && !userComments) {
      getComments();
      console.log("getting comments");
    }
  }, [selection, userComments, userData]);

  return (
    <div>
      {loading ? (
        <div>Loading user</div>
      ) : userData ? (
        <div>
          <span>{userData.displayName}</span>
          <br />
          {isLoggedIn.uid === userData.uid ? <div>This is you</div> : null}
          Karma: {userData.votes.up - userData.votes.down}
          <ul className="profile-selection-container">
            <li
              onClick={() => {
                setSelection(0);
              }}
            >
              <button>posts</button>
            </li>
            <li
              onClick={() => {
                setSelection(1);
              }}
            >
              <button>comments</button>
            </li>
          </ul>
          <div className="user-content-container">
            {selection === 0 && userPosts.length > 0 ? (
              userPosts.map((post) => {
                return (
                  <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
                );
              })
            ) : selection === 0 && userPosts.length === 0 ? (
              <div>No posts yet</div>
            ) : selection === 1 && userComments.length > 0 ? (
              userComments.map((comment) => {
                return (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    isLoggedIn={isLoggedIn}
                    isReference={true}
                  />
                );
              })
            ) : selection === 1 && userComments.length === 0 ? (
              <div>No comments yet</div>
            ) : null}
          </div>
        </div>
      ) : (
        <Navigate to="/page-does-not-exist" />
      )}
    </div>
  );
}

export { UserProfile };
