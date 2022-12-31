import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebaseConfig";

function SubmitPost({isLoggedIn}) {
  //Submissiontypes: 0 - Self.post, 1 - Image/video, 2 - Link
  const [submissionType, setSubmissionType] = useState(0);
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionContent, setSubmissionContent] = useState('');
  const navigate = useNavigate();
  const {subid} = useParams();

  const addPost = async (title, content, subreplica, external) => {
    try {
      const postsRef = collection(db, 'posts');
      const postRef = await addDoc(postsRef, {
      title: title,
      content: content,
      linkExternal: external,
      subreplica: subreplica,
      user: isLoggedIn.displayName,
      uid: isLoggedIn.uid,
      votes: {
        up: 1,
        down: 0,
      },
      score: 1,
      created: serverTimestamp(),
    });
    await setDoc(doc(db, 'users', `${isLoggedIn.uid}`, 'votes', `${postRef.id}`), {
      vote: 'up',
    })
      console.log("Document written with ID: ", postRef.id);
    } catch (e) {
      console.error("Error adding post: ", e);
    }
  }

  const isValidHttpUrl = (string) => {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    console.log(url.origin);
    return url.protocol === 'https:' || url.protocol === 'http:';
  }

  const preparePost = async (e) => {
    e.preventDefault();
    if(submissionType === 0) {
      await addPost(submissionTitle, submissionContent, subid, false);
      navigate(`/r/${subid}/`, {replace: true});
    } else if(submissionType === 2) {
      if(isValidHttpUrl(submissionUrl)) {
        await addPost(submissionTitle, submissionUrl, subid, true);
        navigate(`/r/${subid}/`, {replace: true});
        console.log('link valid');
      } else {
        console.log('link invalid');
      }
    }
  }

  return <div id="SubmitContainer">
    {isLoggedIn?<><button className="selfButton" onClick={() => {setSubmissionType(0)}}>Post</button>
    <button className="mediaButton" onClick={() => {setSubmissionType(1)}}>Image/video</button>
    <button className="linkButton" onClick={() => {setSubmissionType(2)}}>Link</button>
    <form onSubmit={(e) => {preparePost(e)}} >
      <input placeholder="title" value={submissionTitle} onChange={(e) => {setSubmissionTitle(e.target.value)}} maxLength="40" required />
      {
        submissionType === 0 ? <input type="text" placeholder="text(optional)" value={submissionContent} onChange={(e) => {setSubmissionContent(e.target.value)}}/>:
        submissionType === 1 ? <button type="button">upload</button>:
        <input type="url" placeholder="https://" value={submissionUrl} onChange={(e) => {setSubmissionUrl(e.target.value)}} required/>
      }
      <button id="SubmitContent" type="submit">Submit</button>
    </form></>:<Navigate to={`/r/${subid}/`}></Navigate>}
  </div> 
}

export { SubmitPost };