import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import "../../styles/postoverview.css";
import { PostCard } from "./PostCard";
import { getDoc, getDocs, doc, collection } from 'firebase/firestore';
import db from '../firebase';
import { SubList } from "./SubList";

function PostOverview({upvote, downvote, isLoggedIn}) {
  const { id } = useParams();
  const [invalidLink, setInvalidLink] = useState(false);
  const [posts, setPosts] = useState([]);

  const handleUpvote = (postid, isComment) => {
    upvote(postid, isComment);
    const upvoted = posts.map((post) => {
      if(post.id === postid) {
        post.votes.up += 1;
        return post;
      }
      return post;
    })
    setPosts(upvoted);
  }

  const handleDownvote = (postid, isComment) => {
    downvote(postid, isComment);
    const downvoted = posts.map((post) => {
      if(post.id === postid) {
        post.votes.down += 1;
        return post;
      }
      return post;
    })
    setPosts(downvoted);
  }

  useEffect(() => {
    let tempArray = [];
    const updatePosts = async () => {
      if(id === undefined) {
        const postsSnap = await getDocs(collection(db, 'posts'));
        postsSnap.forEach((doc) => {
          tempArray.push({
            title: doc.data().title,
            content: doc.data().content,
            id: doc.id,
            linkExternal: doc.data().linkExternal,
            votes: doc.data().votes,
            subreplica: doc.data().subreplica,
          })
          setPosts(tempArray);
        })
      } else {
        const subSnap = await getDoc(doc(db, 'subreplicas', `${id}`));
        if(subSnap.exists()) {
          const postsSnap = await getDocs(collection(db, 'subreplicas', `${id}`, 'posts'))
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
            })
            setPosts(tempArray);
          });
        } else {
          setInvalidLink(true);
        }
        
      }    
    }
    updatePosts();
  }, [id])

  useEffect(() => {

  }, [posts])

  return (
  <div id="PostContainer">
  <h1 className="sub-header">{id === undefined ? 'Frontpage': id}</h1>
  <SubList></SubList>
  {invalidLink ? <Navigate to='/page-not-found' /> :
  isLoggedIn ?
    <>
    {
      id === undefined ? null:
      <Link to={`/r/${id}/submitpost`} className="submit-link">
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
      {posts ? posts.map((post) => {
        return (
          <PostCard key={post.id} post={post} upvote={handleUpvote} downvote={handleDownvote} isLoggedIn={isLoggedIn}/>
        );
      }): null}
    </ul>
  </div>
  )
}

export { PostOverview };