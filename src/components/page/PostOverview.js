import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import "../../styles/postoverview.css";
import { PostCard } from "./PostCard";
import { getDoc, getDocs, doc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { SubList } from "./SubList";

function PostOverview({upvote, downvote, isLoggedIn}) {
  const { subid } = useParams();
  const [invalidLink, setInvalidLink] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let tempArray = [];
    const updatePosts = async () => {
      if(subid === undefined) {
        const postsSnap = await getDocs(collection(db, 'posts'));
        if(postsSnap.empty) {
          setPosts([]);
        }
        postsSnap.forEach((doc) => {
          tempArray.push({
            title: doc.data().title,
            content: doc.data().content,
            id: doc.id,
            linkExternal: doc.data().linkExternal,
            votes: doc.data().votes,
            subreplica: doc.data().subreplica,
            user: doc.data().user,
          })
          setPosts(tempArray);
        })
      } else {
        const subSnap = await getDoc(doc(db, 'subreplicas', `${subid}`));
        if(subSnap.exists()) {
          const postsSnap = await getDocs(collection(db, 'subreplicas', `${subid}`, 'posts'))
          if(postsSnap.empty) {
            setPosts([]);
          }
          postsSnap.forEach(async (doc) => {
            const docRef = doc.data().ref;
            const docSnap = await getDoc(docRef);
            tempArray.push({
              title: docSnap.data().title,
              content: docSnap.data().content,
              id: docSnap.id,
              linkExternal: docSnap.data().linkExternal,
              votes: docSnap.data().votes,
              subreplica: docSnap.data().subreplica,
              user: docSnap.data().user,
            })
            setPosts(tempArray);
          });
        } else {
          setInvalidLink(true);
          console.log('postoverview invalid link')
        }
        
      }    
    }
    updatePosts();
    console.log('idtrigger');
  }, [subid])

  return (
  <div id="PostContainer">
    <h1 className="sub-header">{subid === undefined ? 'Frontpage': subid}</h1>
    <SubList></SubList>
    {invalidLink ? <Navigate to='/page-not-found' /> :
    isLoggedIn ?
      <>
      {
        subid === undefined ? null:
        <Link to={`/r/${subid}/submitpost`} className="submit-link">
          Submit
        </Link> 
      }
      <Link to="/createsubreplica" className="submit-link">
        Create Subreplica
      </Link>
      </>: 
      <div>Log in or sign up to submit posts</div>
      }
      <ul className="post-list">
        {posts.length > 0 ? posts.map((post) => {
          return (
            <PostCard key={post.id} post={post} upvote={upvote} downvote={downvote} isLoggedIn={isLoggedIn}/>
          );
        }): <div>No posts yet, be the first!</div>}
      </ul>
  </div>
  )
}

export { PostOverview };