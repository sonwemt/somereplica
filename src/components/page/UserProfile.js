import { getDoc, doc, getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { db } from '../firebase';
import { PostCard } from "./PostCard";

function UserProfile({isLoggedIn, upvote, downvote}) {
  const {userid} = useParams();
  const [userData, setUserData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState(0);
  const [userPosts, setUserPosts] = useState(false);
  const [userComments, setUserComments] = useState([]);

  

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
    if(loading) {
      getUserData();
    }
  }, [loading, userData, userid])
  
  useEffect(() => {
    const getUserPosts = async () => {
      let tempArray = [];
      const postsSnap = await getDocs(collection(db, 'users', `${userData.username}`, 'posts'))
      if(!postsSnap.size < 1) {
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
    
  }, [selection])

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
          <li onClick={() => {setSelection(0)}}>posts</li>
          <li onClick={() => {setSelection(1)}}>comments</li>
        </ul>
        <div className="user-content-container">
          {userPosts ?userPosts.map((post) => {
            return <PostCard key={post.id} post={post} upvote={upvote} downvote={downvote}/>
          }) : null}
        </div>
      </div>:
      <Navigate to='/page-does-not-exist' />
    }
  </div>
}

export { UserProfile };