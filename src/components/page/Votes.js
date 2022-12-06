import { useEffect, useState } from "react";
import { updateDoc, increment, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../../styles/votes.css';

function Votes({postid, votes, isLoggedIn, isComment = false}) {
  const [localVotes, setLocalVotes] = useState(votes);
  const [upvoteCast, setUpvoteCast] = useState(false);
  const [downvoteCast, setDownvoteCast] = useState(false);
  const [currentUser, setCurrentUser] = useState(true);

  useEffect(() => {
    const getVoteInfo = async () => {
      let userVoted;
      if(!isComment) {
        userVoted = await getDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${postid}`));
      } else {
        userVoted = await getDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${isComment}`));
      }
      if(userVoted.exists() && (userVoted.data().vote === 'up')) {
        setUpvoteCast(true);
        setDownvoteCast(false);
      } else if(userVoted.exists() && (userVoted.data().vote === 'down')) {
        setUpvoteCast(false);
        setDownvoteCast(true);
      } else {
        setDownvoteCast(false);
        setUpvoteCast(false);
      }
    }
    console.log('vote effect triggered')
    if(!isLoggedIn) {
      setCurrentUser(false);
      setDownvoteCast(false);
      setUpvoteCast(false);
      console.log('vote currentuser set to false')
    } else if(isLoggedIn && !currentUser) {
      setCurrentUser(isLoggedIn.displayName)
      getVoteInfo();
      console.log('isLoggedIn, !currentuser')
    }  else if(isLoggedIn.displayName !== currentUser) {
      getVoteInfo();
      setCurrentUser(isLoggedIn.displayName);
      console.log('vote currentuser should refresh')
    }
  }, [currentUser, isLoggedIn, postid, isComment])

  useEffect(() => {
    console.log('upvotecast:', upvoteCast, ' downvotecast:', downvoteCast);
  }, [downvoteCast, upvoteCast])

  const handleUpvote = async () => {
    if(!isLoggedIn) {
      return;
    } else if(upvoteCast) {
      if(!isComment) {
        await updateDoc(doc(db, 'posts', `${postid}`), {
          "votes.up": increment(-1)
        })
        await setDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${postid}`), {
          vote: 'none',
        })
      } else {
        await updateDoc(doc(db, 'posts', `${postid}`, 'comments', `${isComment}`), {
          "votes.up": increment(-1)
        })
        await setDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${isComment}`), {
          vote: 'none',
        })
      }
      setUpvoteCast(false);
      setLocalVotes({up: localVotes.up - 1, down: localVotes.down})
      return;
    } else if(downvoteCast) {
      if(!isComment) {
        await updateDoc(doc(db, 'posts', `${postid}`), {
          "votes.down": increment(-1)
        })
        await setDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${postid}`), {
          vote: 'up',
        })
      } else {
        await updateDoc(doc(db, 'posts', `${postid}`, 'comments', `${isComment}`), {
          "votes.down": increment(-1)
        })
        await setDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${isComment}`), {
          vote: 'up',
        })
      }
      setDownvoteCast(false);
      setLocalVotes((prev) => ({...prev, down: prev.down - 1}))
    }
    if(!isComment) {
      await updateDoc(doc(db, 'posts', `${postid}`), {
        "votes.up": increment(1)
      })
      await setDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${postid}`), {
        vote: 'up',
      })
    } else {
      await updateDoc(doc(db, 'posts', `${postid}`, 'comments', `${isComment}`), {
        "votes.up": increment(1)
      })
      await setDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${isComment}`), {
        vote: 'up',
      })
    }
    setLocalVotes((prev) => ({...prev, up: prev.up + 1}))
    setUpvoteCast(true);
  }

  const handleDownvote = async () => {
    if(!isLoggedIn) {
      return;
    } else if(downvoteCast) {
      if(!isComment) {
        await updateDoc(doc(db, 'posts', `${postid}`), {
          "votes.down": increment(-1)
        })
        await setDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${postid}`), {
          vote: 'none',
        })
      } else {
        await updateDoc(doc(db, 'posts', `${postid}`, 'comments', `${isComment}`), {
          "votes.down": increment(-1)
        })
        await setDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${isComment}`), {
          vote: 'none',
        })
      }
      setDownvoteCast(false);
      setLocalVotes({up: localVotes.up, down: localVotes.down - 1})
      return;
    } else if(upvoteCast) {
      if(!isComment) {
        await updateDoc(doc(db, 'posts', `${postid}`), {
          "votes.up": increment(-1)
        })
        await setDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${postid}`), {
          vote: 'down',
        })
      } else {
        await updateDoc(doc(db, 'posts', `${postid}`, 'comments', `${isComment}`), {
          "votes.up": increment(-1)
        })
        await setDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${isComment}`), {
          vote: 'down',
        })
      }
      setUpvoteCast(false);
      setLocalVotes((prev) => ({...prev, up: prev.up - 1}))
    }
    if(!isComment) {
      await updateDoc(doc(db, 'posts', `${postid}`), {
        "votes.down": increment(1)
      })
      await setDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${postid}`), {
        vote: 'down',
      })
    } else {
      await updateDoc(doc(db, 'posts', `${postid}`, 'comments', `${isComment}`), {
        "votes.down": increment(1)
      })
      await setDoc(doc(db, 'users', `${isLoggedIn.displayName}`, 'votes', `${isComment}`), {
        vote: 'down',
      })
    }
    setLocalVotes((prev) => ({...prev, down: prev.down + 1}))
    setDownvoteCast(true);
  }

  return <div className="vote-display">
    <button onClick={handleUpvote} className={upvoteCast ? 'upvote-active' : null}>UP</button>
    <div className="vote-score">
    {
    localVotes.up - localVotes.down
    }
    </div>
    <button onClick={handleDownvote} className={downvoteCast ? 'downvote-active' : null}>DOWN</button>
  </div>
}

export { Votes };