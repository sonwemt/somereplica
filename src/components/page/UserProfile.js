import { getDoc, doc, getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { db } from '../firebase';
import { Comment } from "./Comment";
import { PostCard } from "./PostCard";

function UserProfile({isLoggedIn}) {
  const {userid} = useParams();
  const [userData, setUserData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState(0);
  const [userPosts, setUserPosts] = useState(false);
  const [userComments, setUserComments] = useState(false);

  

  useEffect(() => {
    const getUserData = async () => {
      console.log(userid)
      const userSnap = await getDoc(doc(db, 'users', `${userid}`));
      if(userSnap.exists()) {
        setUserData({
          username: userSnap.id,
          votes: userSnap.data().votes,
        })
      } else {
        setUserData(false);
      }
      setLoading(false);
    }
    if(loading || userData.username !== userid) {
      getUserData();
    }
  }, [loading, userData, userid])
  
  useEffect(() => {
    const getUserPosts = async () => {
      let tempArray = [];
      const postsSnap = await getDocs(collection(db, 'users', `${userData.username}`, 'posts'))
      if(postsSnap.empty) {
        setUserPosts([]);
      }
      postsSnap.forEach(async (doc) => {
        const docRef = doc.data().ref;
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data().title)
        tempArray.push({
          title: docSnap.data().title,
          content: docSnap.data().content,
          id: docSnap.id,
          linkExternal: docSnap.data().linkExternal,
          votes: docSnap.data().votes,
          subreplica: docSnap.data().subreplica,
          user: docSnap.data().user,
        })
        setUserPosts(tempArray);
      });
    }
    if(!userPosts && userData) {
      getUserPosts();
    }
  }, [userData, userPosts])

  useEffect(() => {
    console.log(selection);
    const getComments = async () => {
      let commentArray = [];
      const commentsSnap = await getDocs(collection(db, 'users', `${userData.username}`, 'comments'));
      if(commentsSnap.empty) {
        setUserComments([]);
        console.log('no comments fetched')
      }
      commentsSnap.forEach(async (doc) => {
        const docRef = doc.data().ref;
        const docSnap = await getDoc(docRef);
        commentArray.push({
          username: docSnap.data().username,
          comment: docSnap.data().comment,
          votes: docSnap.data().votes,
          id: docSnap.id,
          postid: docSnap.data().postid,
          subreplica: docSnap.data().subreplica,
        })
        setUserComments(commentArray);
      })
    }
    if(selection === 1 && userData && !userComments) {
      getComments();
      console.log('getting comments')
    }
  }, [selection, userComments, userData])

  return <div>
    {
     loading ?
     <div>Loading user</div>: 
      userData ? 
      <div>
        <span>{userData.username}</span><br/>
        {isLoggedIn.username === userData.username ? <div>You are currently logged in</div>: null}
        Karma: {userData.votes.up - userData.votes.down}
        <ul className="profile-selection-container">
          <li onClick={() => {setSelection(0)}}><button>posts</button></li>
          <li onClick={() => {setSelection(1)}}><button>comments</button></li>
        </ul>
        <div className="user-content-container">
          {selection === 0 && userPosts ? userPosts.map((post) => {
            return <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
          }) : selection === 1 && userComments ? userComments.map((comment) => {
            return <Comment key={comment.id} comment={comment} isLoggedIn={isLoggedIn} isReference={true}/>
          }): null}
        </div>
      </div>:
      <Navigate to='/page-does-not-exist' />
    }
  </div>
}

export { UserProfile };