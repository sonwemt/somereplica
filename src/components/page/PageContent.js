import { Route, Routes } from 'react-router-dom';
import '../../styles/pagecontent.css';
import { Comments } from './Comments';
import { PostOverview } from './PostOverview';
import { SubmitPost } from './SubmitPost';
import { PageNotFound} from '../PageNotFound';
import { UserProfile } from './UserProfile';
import db from '../firebase';
import { collection, addDoc, updateDoc, increment, doc } from 'firebase/firestore';
import { CreateSubreplica } from './CreateSubreplica';

const postsRef = collection(db, 'posts');

function PageContent({isLoggedIn, showLoginPrompt}) {
  const addPost = async (title, content, subreplica, external) => {
    try {
      const postRef = await addDoc(postsRef, {
      title: title,
      content: content,
      linkExternal: external,
      subreplica: subreplica,
      user: isLoggedIn.username,
      votes: {
        up: 1,
        down: 0,
      },
    });
    await addDoc(collection(db, 'subreplicas', `${subreplica}`, 'posts'), {
      ref: postRef
    });
      console.log("Document written with ID: ", postRef.id);
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
  }
  

  return <div id="PageContainer">
      <Routes>
        <Route path='/r/:subid' element={<PostOverview upvote={registerUpvote} downvote={registerDownvote} isLoggedIn={isLoggedIn} />} />
        <Route path='/r/:subid/comments/:commentsid' element={<Comments addComment={addComment} upvote={registerUpvote} downvote={registerDownvote} isLoggedIn={isLoggedIn} />} />
        <Route path='/' element={<PostOverview upvote={registerUpvote} downvote={registerDownvote} isLoggedIn={isLoggedIn} />} />
        <Route path='/r/:subid/submitpost' element={<SubmitPost isLoggedIn={isLoggedIn} showLoginPrompt={showLoginPrompt} addPost={addPost} />}/>
        <Route path='/createsubreplica' element={<CreateSubreplica isLoggedIn={isLoggedIn}/>} />
        <Route path='/u/:userid' element={<UserProfile isLoggedIn={isLoggedIn}/>} />
        <Route path='*' element={<PageNotFound /> } />
      </Routes>
  </div>
}

export { PageContent };