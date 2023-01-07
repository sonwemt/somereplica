import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { SubmitComment } from "./SubmitComment";
import '../../styles/comments.css';
import { PostCard } from "./PostCard";
import { db } from '../firebaseConfig';
import { collection, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { SortDropdown } from "./SortDropdown";
import { CommentThread } from "./CommentThread";

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
  const [sortFilter, setSortFilter] = useState({score: true, order: 'desc'});

  const updateComments = (snapshot, replace = false) => {
    let tempArray = [];
    snapshot.forEach((doc) => {
      tempArray.push({
        id: doc.id,
        parentid: doc.ref.parent.parent.id,
        children: [],
        localDate: doc.data().created.toDate(),
        ...doc.data()
      })
    })

    if(replace) {
      setComments((prev) => [...prev, ...tempArray])
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
          localDate: postSnap.data().created.toDate(),
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
      const postRef = doc(db, 'posts', `${currentPost.id}`)
      let commentQueryParameters = [];
      commentQueryParameters.push(where('commentType', 'array-contains', 'top'))
      if(sortFilter.score) {
        commentQueryParameters.push(orderBy('score', sortFilter.order))
      }
      commentQueryParameters.push(orderBy('created', sortFilter.score ? 'desc': sortFilter.order))
      commentQueryParameters.push(limit(commentsToLoad))

      const commentQuery = query(collection(postRef, 'comments'), ...commentQueryParameters);
      const commentCount = await getCountFromServer(query(collection(postRef, 'comments'), where('commentType', 'array-contains', 'top')));
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
  }, [currentPost, sortFilter]);

  useEffect(() => {
    console.log('comments state', comments);
  })

  useEffect(() => {

    const incrementPage = async () => {
      const postRef = doc(db, 'posts', `${postid}`);

      let commentQueryParameters = [];
      commentQueryParameters.push(where('commentType', 'array-contains', 'top'))

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
      const commentCount = await getCountFromServer(query(collection(postRef, 'comments'),where('commentType', 'array-contains', 'top')));
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

  return (
    <div className="commentsContainer">
      {
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
              return <CommentThread key={comment.id} comment={comment} isLoggedIn={isLoggedIn} sortFilter={sortFilter} />
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
    }
    </div>
  );
}

export { Comments };