import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function SubmitPost({isLoggedIn, showLoginPrompt, addPost}) {
  // 0 - Self.post, 1 - Image/video, 2 - Link
  const [submissionType, setSubmissionType] = useState(0);
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionContent, setSubmissionContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if(!isLoggedIn) {
      showLoginPrompt();
    }
  })

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

  const preparePost = (e) => {
    e.preventDefault();
    if(submissionType === 0) {
      addPost(submissionTitle, submissionContent, false);
      navigate('/', { replace: true });
    } else if(submissionType === 2) {
      if(isValidHttpUrl(submissionUrl)) {
        addPost(submissionTitle, submissionUrl, true);
        navigate('/', { replace: true });
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
      <input placeholder="title" value={submissionTitle} onChange={(e) => {setSubmissionTitle(e.target.value)}} required />
      {
        submissionType === 0 ? <input type="text" placeholder="text(optional)" value={submissionContent} onChange={(e) => {setSubmissionContent(e.target.value)}}/>:
        submissionType === 1 ? <button type="button">upload</button>:
        <input type="url" placeholder="https://" value={submissionUrl} onChange={(e) => {setSubmissionUrl(e.target.value)}} required/>
      }
      <button id="SubmitContent" type="submit">Submit</button>
    </form></>:<Navigate to="/"></Navigate>}
  </div> 
}

export { SubmitPost };