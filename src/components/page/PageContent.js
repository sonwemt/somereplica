import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import '../../styles/pagecontent.css';
import { Comments } from './Comments';
import { PostOverview } from './PostOverview';
import { SubmitPost } from './SubmitPost';
import { PageNotFound} from '../PageNotFound';
import { UserProfile } from './UserProfile';
import db from '../firebase';
import { collection, getDocs, addDoc, updateDoc, increment, doc } from 'firebase/firestore';

const postsRef = collection(db, 'posts');

function PageContent({isLoggedIn, showLoginPrompt}) {
  const [listOfPosts, setListOfPosts] = useState([]);

  const updatePosts = async () => {
    const postsSnap = await getDocs(postsRef);
    let tempArray = [];
    postsSnap.forEach((doc) => {
      tempArray.push({
        title: doc.data().title,
        content: doc.data().content,
        id: doc.id,
        linkExternal: doc.data().linkExternal,
        votes: doc.data().votes,
      })
    })
    setListOfPosts(tempArray);
  }

  const addPost = async (title, content, external) => {
    try {
      const postRef = await addDoc(postsRef, {
      title: title,
      content: content,
      linkExternal: external,
      votes: {
        up: 1,
        down: 0,
      },
    });
      console.log("Document written with ID: ", postRef.id);
      updatePosts();
    } catch (e) {
      console.error("Error adding post: ", e);
    }
  }

  const addComment = async (postId, comment) => {
    try {
      const commentRef = await addDoc(collection(postsRef, `${postId}`, 'comments'), {
        username: isLoggedIn.username,
        comment: comment,
        votes: {
          up: 1,
          down: 0,
        }
      });
      console.log("Document written with ID: ", commentRef.id);
      updatePosts();
    } catch (e) {
      console.error("Error adding comment", e)
    }
  }

  const registerUpvote = async (postid, isComment) => {
    if(!isComment) {
      await updateDoc(doc(postsRef, `${postid}`), {
        "votes.up": increment(1)
      })
    } else {
      await updateDoc(doc(postsRef, `${postid}`, 'comments', `${isComment}`), {
        "votes.up": increment(1)
      })
    }
    updatePosts();
  }

  const registerDownvote = async (postid, isComment) => {
    if(!isComment) {
      await updateDoc(doc(postsRef, `${postid}`), {
        "votes.down": increment(1)
      })
    } else {
      await updateDoc(doc(postsRef, `${postid}`, 'comments', `${isComment}`), {
        "votes.down": increment(1)
      })
    }
    updatePosts();
  }
  

  return <div id="PageContainer">
      <Routes>
        <Route path='/' element={<PostOverview posts={listOfPosts} updatePosts={updatePosts} upvote={registerUpvote} downvote={registerDownvote} isLoggedIn={isLoggedIn} />} />
        <Route path='/comments/:id' element={<Comments updatePosts={updatePosts} addComment={addComment} upvote={registerUpvote} downvote={registerDownvote} isLoggedIn={isLoggedIn} />} />
        <Route path='/submitpost' element={<SubmitPost isLoggedIn={isLoggedIn} showLoginPrompt={showLoginPrompt} addPost={addPost} />}/>
        <Route path='/profile' element={<UserProfile user={isLoggedIn}/>} />
        <Route path='*' element={<PageNotFound /> } />
      </Routes>
  </div>
}

export { PageContent };