import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { SubmitComment } from "./SubmitComment";
import { Comment } from "./Comment";
import '../../styles/comments.css';
import { PostCard } from "./PostCard";
import { db } from '../firebase';
import { collection, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { SortDropdown } from "./SortDropdown";

const commentsToLoad = 5;

function Comments({ isLoggedIn }) {
  const { postid } = useParams();
  const { subid } = useParams();
  const [currentPost, setCurrentPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [nextPage, setNextPage] = useState(1);
  const [lastVisible, setLastVisible] = useState(null);
  const [noMoreComments, setNoMoreComments] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [sortFilter, setSortFilter] = useState({score: false, order: 'desc'});

  const updateComments = (snapshot, replace = false) => {
    let tempArray = [];
    snapshot.forEach((doc) => {
      tempArray.push({
        id: doc.id,
        ...doc.data()
      })
    })
    if(replace) {
      setComments((prev) => [...prev, ...tempArray]);
    } else {
      setComments(() => tempArray);
    }
  }

  useEffect(() => {
    const getPost = async () => {
      const postRef = doc(db, 'posts', `${postid}`)
      const postSnap = await getDoc(postRef);
      if(postSnap.exists()) {
        console.log('idmatch')
        setCurrentPost({
          id: postSnap.id,
          ...postSnap.data()
        });
      } else {
        console.log('comments invalid')
        setInvalidLink(true);
      }
    }
    getPost();
  }, [postid]);
  
  useEffect(() => {
    const getComments = async () => {
      const postRef = doc(db, 'posts', `${postid}`)
      let commentQueryParameters = [];
      if(sortFilter.score) {
        commentQueryParameters.push(orderBy('score', sortFilter.order))
      }
      commentQueryParameters.push(orderBy('created', sortFilter.score ? 'desc': sortFilter.order))
      commentQueryParameters.push(limit(commentsToLoad))

      const commentQuery = query(collection(postRef, 'comments'), ...commentQueryParameters);
      const commentCount = await getCountFromServer(collection(postRef, 'comments'));
      const commentSnap = await getDocs(commentQuery);

      setLastVisible(() => commentSnap.docs[commentSnap.docs.length - 1]);

      if(commentCount.data().count <= commentsToLoad) {
        setNoMoreComments(true);
      } else {
        setNoMoreComments(false);
      }
      updateComments(commentSnap);
    }
    
    if(currentPost !== null) {
      getComments();
    }
  }, [currentPost, postid, sortFilter])

  useEffect(() => {
    const incrementPage = async () => {
      const postRef = doc(db, 'posts', `${postid}`);

      let commentQueryParameters = [];

      if(sortFilter.score) {
        commentQueryParameters.push(orderBy('score', sortFilter.order))
      }
      commentQueryParameters.push(orderBy('created', sortFilter.score ? 'desc': sortFilter.order))
      
      if(sortFilter.score) {
        commentQueryParameters.push(startAfter(lastVisible.data().score, lastVisible.data().created));
      } else {
        commentQueryParameters.push(startAfter(lastVisible.data().created));
      }
      commentQueryParameters.push(limit(commentsToLoad * nextPage))

      const commentQuery = query(collection(postRef, 'comments'), ...commentQueryParameters);
      const commentCount = await getCountFromServer(collection(postRef, 'comments'));
      const commentSnap = await getDocs(commentQuery);
      setLastVisible(() => commentSnap.docs[commentSnap.docs.length - 1]);

      if(commentCount.data().count <= commentsToLoad * nextPage) {
        setNoMoreComments(true);
      } else {
        setNoMoreComments(false);
      }
      updateComments(commentSnap, true);

      setLastPage(nextPage);
    }

    if(lastPage < nextPage) {
      incrementPage();
    }
  }, [postid, lastVisible, lastPage, nextPage, sortFilter])

  return <div className="commentsContainer">{
    currentPost ? 
    <>
      <div className="postcard">
        <PostCard post={currentPost} isLoggedIn={isLoggedIn} detailed={true}></PostCard>
      </div>
      <SubmitComment postid={postid} subid={subid} isLoggedIn={isLoggedIn} />
       <ul className="comment-list">
        <SortDropdown sortFilter={sortFilter} setSortFilter={setSortFilter}/>
       {
       comments.length > 0 ?
        comments.map((comment) => {
          return <li key={comment.id} className="comment-item">
            <Comment comment={comment} isLoggedIn={isLoggedIn}/>
          </li>;
        }): 
        <div>No comments yet</div>
        }
        {
        (!noMoreComments) && lastPage < nextPage ? <div>Loading</div>:
        !noMoreComments ? <button onClick={() => setNextPage(nextPage + 1)}>Get more comments</button>: 
        null
        }
      </ul>
      
    </>: 
    invalidLink ? 
    <Navigate to='/page-does-not-exist'></Navigate>:
    <div>Loading</div>
  }</div>
}

export { Comments };