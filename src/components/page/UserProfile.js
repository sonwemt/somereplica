import { getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import db from '../firebase';

function UserProfile({isLoggedIn}) {
  const {userid} = useParams();
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      console.log(userid)
      const userSnap = await getDoc(doc(db, 'users', `${userid}`));
      if(userSnap.exists()){
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

  return <div>
    {
     loading ?
     <div>Loading user</div>: 
    userData ? 
      <div>
        <span>{userData.username}</span><br/>
        {isLoggedIn.username === userData.username ? <div>You are currently logged in</div>: null}
        Karma: {userData.votes.up - userData.votes.down}
      </div>:
      <Navigate to='/page-does-not-exist' />
    }
  </div>
}

export { UserProfile };