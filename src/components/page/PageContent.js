import { Route, Routes } from 'react-router-dom';
import '../../styles/pagecontent.css';
import { Comments } from './Comments';
import { PostOverview } from './PostOverview';
import { SubmitPost } from './SubmitPost';
import { PageNotFound} from '../PageNotFound';
import { UserProfile } from './UserProfile';
import { db } from '../firebase';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { CreateSubreplica } from './CreateSubreplica';

const postsRef = collection(db, 'posts');

function PageContent({isLoggedIn}) {
  const addPost = async (title, content, subreplica, external) => {
    try {
      const postRef = await addDoc(postsRef, {
      title: title,
      content: content,
      linkExternal: external,
      subreplica: subreplica,
      user: isLoggedIn.displayName,
      votes: {
        up: 1,
        down: 0,
      },
    });
    await addDoc(collection(db, 'subreplicas', `${subreplica}`, 'posts'), {
      ref: postRef
    });
    await addDoc(collection(db, 'users', `${isLoggedIn.displayName}`, 'posts'), {
      ref: postRef
    });
    await setDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${postRef.id}`), {
      vote: 'up',
    })
      console.log("Document written with ID: ", postRef.id);
    } catch (e) {
      console.error("Error adding post: ", e);
    }
  }

  const addComment = async (postid, subid ,comment) => {
    try {
      const commentRef = await addDoc(collection(postsRef, `${postid}`, 'comments'), {
        username: isLoggedIn.displayName,
        comment: comment,
        votes: {
          up: 1,
          down: 0,
        },
        postid: postid,
        subreplica: subid,
      });
      await addDoc(collection(db, 'users', `${isLoggedIn.displayName}`, 'comments'), {
        ref: commentRef,
      });
      await setDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${commentRef.id}`), {
        vote: 'up',
      })
      console.log("Document written with ID: ", commentRef.id);
    } catch (e) {
      console.error("Error adding comment", e)
    }
  }
  

  return <div id="PageContainer">
      <Routes>
        <Route path='/r/:subid' element={<PostOverview isLoggedIn={isLoggedIn} />} />
        <Route path='/r/:subid/comments/:postid' element={<Comments addComment={addComment} isLoggedIn={isLoggedIn} />} />
        <Route path='/' element={<PostOverview isLoggedIn={isLoggedIn} />} />
        <Route path='/r/:subid/submitpost' element={<SubmitPost isLoggedIn={isLoggedIn} addPost={addPost} />}/>
        <Route path='/createsubreplica' element={<CreateSubreplica isLoggedIn={isLoggedIn}/>} />
        <Route path='/u/:userid' element={<UserProfile isLoggedIn={isLoggedIn} />} />
        <Route path='*' element={<PageNotFound /> } />
      </Routes>
  </div>
}

export { PageContent };