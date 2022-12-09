import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import "../../styles/postoverview.css";
import { PostCard } from "./PostCard";
import { getDoc, getDocs, doc, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { SubList } from "./SubList";

function PostOverview({isLoggedIn}) {
  const { subid } = useParams();
  const [invalidLink, setInvalidLink] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const updatePosts = (snapshot) => {
    let tempArray = [];
    setPosts([]);
    snapshot.forEach((doc) => {
      tempArray.push({
        id: doc.id,
        ...doc.data(),
      })
      setPosts(tempArray);
    })
  }

  useEffect(() => {
    const checkPageState = async () => {
      if(subid === undefined) {
        const snapshot = await getDocs(collection(db, 'posts'));
        updatePosts(snapshot);
      } else {
        const subSnap = await getDoc(doc(db, 'subreplicas', `${subid}`));
        if(subSnap.exists()) {
          const subQuery = query(
            collection(db, 'posts'), 
            where('subreplica', '==', `${subid}`)
            );
          const snapshot = await getDocs(subQuery);
          updatePosts(snapshot);
        } else {
          setInvalidLink(true);
          console.log('postoverview invalid link')
        }
      }    
    }
    checkPageState();
    console.log('subid change');
  }, [subid])

  return (
  <div id="PostContainer">
    <h1 className="sub-header">{subid === undefined ? 'Frontpage': subid}</h1>
    <SubList className="list-of-subs"/>
    {invalidLink ? <Navigate to='/page-not-found' /> :
    isLoggedIn ?
      <>
        {
          subid === undefined ? null:
          <Link to={`/r/${subid}/submitpost`} className="submit-link">
            Submit
          </Link> 
        }
        <Link to="/createsubreplica" className="replica-link">
          Create Subreplica
        </Link>
      </>: 
      <div>Log in or sign up to submit posts</div>
      }
      <ul className="post-list">
        {posts.length > 0 ? posts.map((post) => {
          return (
            <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn}/>
          );
        }): <div>No posts yet, be the first!</div>}
      </ul>
      <div className="post-navigation">
        {
          currentPage > 1 ?
          <button onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>:
          null
        }
        <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>
  </div>
  )
}

export { PostOverview };