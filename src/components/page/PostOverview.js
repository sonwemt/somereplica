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
import { SortDropdown } from "./SortDropdown";

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
  const [sortFilter, setSortFilter] = useState({score: false, order: 'desc'});

  const updatePosts = (snapshot, reverse = false) => {
    let tempArray = [];
    setPosts(() => []);
    snapshot.forEach((doc) => {
        tempArray.push({
          id: doc.id,
          ...doc.data(),
        })
    })
    if(reverse) {
      tempArray.reverse()
      setPosts(() => tempArray);
    } else {
      setPosts(() => tempArray);
    }
  }

  useEffect(() => {
    const getFirstPage = async () => {
      const postRef = collection(db, 'posts');
      let postQuery;
      let countQuery;
      let postQueryParameters = [];

      if(subid === undefined) {
        countQuery = postRef;

        if(sortFilter.score) {
          postQueryParameters.push(orderBy('score', sortFilter.order));
        } 
        postQueryParameters.push(orderBy('created', sortFilter.score ? 'desc': sortFilter.order));
        postQueryParameters.push(limit(postsPerPage));
      } else {
        const subSnap = await getDoc(doc(db, 'subreplicas', `${subid}`));
        if(subSnap.exists()) {
          countQuery = query(
            postRef,
            where('subreplica', '==', `${subid}`),
          );

          postQueryParameters.push(where('subreplica', '==', `${subid}`));
          if(sortFilter.score) {
            postQueryParameters.push(orderBy('score', sortFilter.order));
          } 
          postQueryParameters.push(orderBy('created', sortFilter.score ? 'desc': sortFilter.order));
          postQueryParameters.push(limit(postsPerPage));
        } else {
          setInvalidLink(true);
          console.log('subreplica not found');
          return;
        }
      }

      const postCount = await getCountFromServer(countQuery);
      if(postCount.data().count <= postsPerPage) {
        setNoMorePosts(true);
      } else {
        setNoMorePosts(false);
      }

      postQuery = query(postRef, ...postQueryParameters);

      const snapshot = await getDocs(postQuery);
      setFirstVisible(snapshot.docs[0]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1])
      updatePosts(snapshot);
    }

    getFirstPage();
    setlastPage(1);
    setCurrentPage(1);
    console.log('subid change');
  }, [subid, sortFilter])

  useEffect(() => {
    const incrementPage = async () => {
      const postRef = collection(db, 'posts');
      let postQuery;
      let countQuery;
      let postQueryParameters = [];

      if(subid === undefined) {
        countQuery = postRef;

        if(sortFilter.score) {
          postQueryParameters.push(orderBy('score', sortFilter.order))
        }
        postQueryParameters.push(orderBy('created', sortFilter.score? 'desc': sortFilter.order))
        
      
      } else {
        countQuery = query(
          postRef,
          where('subreplica', '==', `${subid}`),
        )

        postQueryParameters.push(where('subreplica', '==', `${subid}`));
        if(sortFilter.score) {
          postQueryParameters.push(orderBy('score', sortFilter.order))
        }
        postQueryParameters.push(orderBy('created', sortFilter.score? 'desc': sortFilter.order))
      }

      if(sortFilter.score) {
        postQueryParameters.push(startAfter(lastVisible.data().score, lastVisible.data().created))
      } else {
        postQueryParameters.push(startAfter(lastVisible.data().created))
      }
      postQueryParameters.push(limit(postsPerPage))

      postQuery = query(postRef, ...postQueryParameters);

      const snapshot = await getDocs(postQuery);
      const postCount = await getCountFromServer(countQuery);
      console.log(currentPage * postsPerPage)
      if(postCount.data().count <= currentPage * postsPerPage) {
        setNoMorePosts(true);
      } else {
        setNoMorePosts(false);
      }
      updatePosts(snapshot);
      setFirstVisible(snapshot.docs[0]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1])
      setlastPage(currentPage);
    }

    const decrementPage = async () => {
      const postRef = collection(db, 'posts');
      let postQuery;
      let countQuery;
      let postQueryParameters = [];

      if(subid === undefined) {
        countQuery = postRef;

        if(sortFilter.score) {
          postQueryParameters.push(orderBy('score', sortFilter.order === 'asc' ? 'desc': 'asc'))
        }
        postQueryParameters.push(orderBy('created', sortFilter.score ? 'asc': sortFilter.order === 'asc' ? 'desc': 'asc'))

          // orderBy(sortFilter.type, sortFilter.order === 'asc'? 'desc' : 'asc'),
          
      } else {
        countQuery = query(
          postRef,
          where('subreplica', '==', `${subid}`),
        )

        postQueryParameters.push(where('subreplica', '==', `${subid}`));
        if(sortFilter.score) {
          postQueryParameters.push(orderBy('score', sortFilter.order))
        }
        postQueryParameters.push(orderBy('score', sortFilter.order))
        postQueryParameters.push(orderBy('created', sortFilter.order === 'asc'? 'desc': sortFilter.order))
      }
      if(sortFilter.score) {
        postQueryParameters.push(startAfter(firstVisible.data().score, firstVisible.data().created))
      } else {
        postQueryParameters.push(startAfter(firstVisible.data().created))
      }
      postQueryParameters.push(limit(postsPerPage))

      postQuery = query(postRef, ...postQueryParameters);
      const postCount = await getCountFromServer(countQuery);
      if(postCount.data().count <= currentPage * postsPerPage) {
        setNoMorePosts(true);
      } else {
        setNoMorePosts(false);
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
      decrementPage();
    }
  }, [currentPage, lastPage, subid, lastVisible, firstVisible, sortFilter]);

  return (
  <div id="PostContainer">
    <h1 className="sub-header">{subid === undefined ? 'Frontpage': subid}</h1>
    <SortDropdown setSortFilter={setSortFilter}/>
    <SubList className="list-of-subs"/>
    {
      invalidLink ?<Navigate to='/page-not-found' /> :
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
      <button onClick={() => setCurrentPage(currentPage - 1) } disabled={currentPage <= 1}>Prev</button>
      <button onClick={() => setCurrentPage(currentPage + 1)} disabled={noMorePosts && currentPage === lastPage}>Next</button>
    </div>
  </div>
  );
}

export { PostOverview };