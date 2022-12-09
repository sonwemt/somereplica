import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import "../../styles/postoverview.css";
import { PostCard } from "./PostCard";
import { getDoc, getDocs, doc, collection, query, where, orderBy, limit, startAfter, endAt } from 'firebase/firestore';
import { db } from '../firebase';
import { SubList } from "./SubList";

const postsPerPage = 3;

function PostOverview({isLoggedIn}) {
  const { subid } = useParams();
  const [invalidLink, setInvalidLink] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setlastPage] = useState(1);
  const [firstVisible, setFirstVisible] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [noMorePosts, setNoMorePosts] = useState(false);

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
        const postQuery = query(collection(db, 'posts'), 
        orderBy('created', 'asc'),
        limit(postsPerPage)
        );
        const snapshot = await getDocs(postQuery);
        if(snapshot.empty || snapshot.docs.length < postsPerPage) {
          setNoMorePosts(true);
        }
        setFirstVisible(snapshot.docs[0]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1])
        updatePosts(snapshot);
      } else {
        const subSnap = await getDoc(doc(db, 'subreplicas', `${subid}`));
        if(subSnap.exists()) {
          const subQuery = query(
            collection(db, 'posts'),
            where('subreplica', '==', `${subid}`),
            orderBy('created', 'asc'),
            limit(postsPerPage),
          )
          const snapshot = await getDocs(subQuery);
          console.log(snapshot.docs.length)
          if(snapshot.empty || snapshot.docs.length < postsPerPage) {
            setNoMorePosts(true);
          }
          setFirstVisible(snapshot.docs[0]);
          setLastVisible(snapshot.docs[snapshot.docs.length - 1])
          updatePosts(snapshot);
        } else {
          setInvalidLink(true);
          console.log('postoverview invalid link')
        }
      }    
    }
    checkPageState();
    setlastPage(1);
    setCurrentPage(1);
    setNoMorePosts(false);
    console.log('subid change');
  }, [subid])

  useEffect(() => {
    const incrementPage = async () => {
      let pageQuery;
      if(subid === undefined) {
        pageQuery = query(
          collection(db, 'posts'), 
          orderBy('created', 'asc'),
          startAfter(lastVisible.data().created),
          limit(postsPerPage)
        );
      } else {
        pageQuery = query(
          collection(db, 'posts'),
          where('subreplica', '==', `${subid}`),
          orderBy('created', 'asc'),
          startAfter(lastVisible.data().created),
          limit(postsPerPage),
        )
      }
      const snapshot = await getDocs(pageQuery);
      if(snapshot.empty || snapshot.docs.length < postsPerPage) {
        setNoMorePosts(true);
      }
      if(snapshot.docs.length > 0) {
        updatePosts(snapshot);
      }
      setLastVisible(snapshot.docs[snapshot.docs.length - 1])
      setFirstVisible(snapshot.docs[0]);
    }

    const decrementPage = async () => {
      let pageQuery;
      if(subid === undefined) {
        pageQuery = query(
          collection(db, 'posts'), 
          orderBy('created', 'asc'),
          endAt(firstVisible.data().created),
          limit(postsPerPage)
        );
      } else {
        pageQuery = query(
          collection(db, 'posts'),
          where('subreplica', '==', `${subid}`),
          orderBy('created', 'asc'),
          endAt(firstVisible.data().created),
          limit(postsPerPage),
        )
      }
      const snapshot = await getDocs(pageQuery);
      setFirstVisible(snapshot.docs[0]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1])
      updatePosts(snapshot);
    }

    if(currentPage > lastPage) {
      incrementPage();
      setlastPage(currentPage);
    } else if (currentPage < lastPage) {
      decrementPage();
      setNoMorePosts(false);
      setlastPage(currentPage);
    }
  }, [currentPage, lastPage, subid, lastVisible, firstVisible])

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
        {
          !noMorePosts ? 
          <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>: 
          null
        }
      </div>
  </div>
  )
}

export { PostOverview };