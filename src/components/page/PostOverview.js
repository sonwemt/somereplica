import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import "../../styles/postoverview.css";
import { PostCard } from "./PostCard";
import { 
  getDoc,
  getDocs,
  doc,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '../firebase';
import { SubList } from "./SubList";

const postsPerPage = 5;

function PostOverview({isLoggedIn}) {
  const { subid } = useParams();
  const [invalidLink, setInvalidLink] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setlastPage] = useState(1);
  const [firstVisible, setFirstVisible] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [noMorePosts, setNoMorePosts] = useState(false);

  const updatePosts = (snapshot, desc = false) => {
    let tempArray = [];
    setPosts(() => []);
    snapshot.forEach((doc) => {
        tempArray.push({
          id: doc.id,
          ...doc.data(),
        })
    })
    if(desc) {
      tempArray.reverse()
      setPosts(() => tempArray);
    } else {
      setPosts(() => tempArray);
    }
  }

  useEffect(() => {
    const getInitialState = async () => {
      let postQuery;
      let countQuery;
      const postRef = collection(db, 'posts');
      if(subid === undefined) {
        countQuery = query(
          postRef,
          orderBy('created', 'asc'),
        )
        postQuery = query(
          postRef, 
          orderBy('created', 'asc'),
          limit(postsPerPage)
        );
      } else {
        const subSnap = await getDoc(doc(db, 'subreplicas', `${subid}`));
        if(subSnap.exists()) {
          countQuery = query(
            postRef,
            where('subreplica', '==', `${subid}`),
            orderBy('created', 'asc'),
          )
          postQuery = query(
            postRef,
            where('subreplica', '==', `${subid}`),
            orderBy('created', 'asc'),
            limit(postsPerPage),
          )
        } else {
          setInvalidLink(true);
          console.log('postoverview invalid link');
          return;
        }
        const postCount = await getCountFromServer(countQuery);
        if(postCount.data().count <= postsPerPage) {
          setNoMorePosts(true);
        } 
      }
      const snapshot = await getDocs(postQuery);
      setFirstVisible(snapshot.docs[0]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1])
      updatePosts(snapshot);
    }
    getInitialState();
    setlastPage(1);
    setCurrentPage(1);
    setNoMorePosts(false);
    console.log('subid change');
  }, [subid])

  useEffect(() => {
    const incrementPage = async () => {
      let postQuery;
      let countQuery;
      if(subid === undefined) {
        postQuery = query(
          collection(db, 'posts'), 
          orderBy('created', 'asc'),
          startAfter(lastVisible.data().created),
          limit(postsPerPage)
        );
        countQuery = query(
          collection(db, 'posts'),
          orderBy('created', 'asc'),
        )
      } else {
        postQuery = query(
          collection(db, 'posts'),
          where('subreplica', '==', `${subid}`),
          orderBy('created', 'asc'),
          startAfter(lastVisible.data().created),
          limit(postsPerPage),
        )
        countQuery = query(
          collection(db, 'posts'),
          where('subreplica', '==', `${subid}`),
          orderBy('created', 'asc'),
        )
      }
      const snapshot = await getDocs(postQuery);
      const postCount = await getCountFromServer(countQuery);
      console.log(currentPage * postsPerPage)
      if(postCount.data().count <= currentPage * postsPerPage) {
        setNoMorePosts(true);
      } 
      if(snapshot.docs.length > 0) {
        updatePosts(snapshot);
        setFirstVisible(snapshot.docs[0]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1])
      }
      setlastPage(currentPage);
    }

    const decrementPage = async () => {
      let postQuery;
      if(subid === undefined) {
        postQuery = query(
          collection(db, 'posts'),
          orderBy('created', 'desc'),
          startAfter(firstVisible.data().created),
          limit(postsPerPage),
        );
      } else {
        postQuery = query(
          collection(db, 'posts'),
          where('subreplica', '==', `${subid}`),
          orderBy('created', 'desc'),
          startAfter(firstVisible.data().created),
          limit(postsPerPage),
        )
      }
      const snapshot = await getDocs(postQuery);
      setFirstVisible(snapshot.docs[snapshot.docs.length - 1])
      setLastVisible(snapshot.docs[0])
      updatePosts(snapshot, true);
      setlastPage(currentPage);
    }

    if(currentPage > lastPage) {
      incrementPage();
    } else if (currentPage < lastPage) {
      setNoMorePosts(false);
      decrementPage();
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
          !noMorePosts && currentPage === lastPage ? 
          <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>: 
          null
        }
      </div>
  </div>
  )
}

export { PostOverview };