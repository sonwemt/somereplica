import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import '../../styles/pagecontent.css';
import { Comments } from './Comments';
import { PostOverview } from './PostOverview';
import { SubmitPost } from './SubmitPost';

function PageContent() {
  const [listOfPosts, setListOfPosts] = useState([
    {
      title: "First user submitted post",
      content: "linkplaceholder",
      id: "post1",
      comments: [
        {
          username: "User1",
          comment: "Lorem ipsum",
          id: "post1comment1",
          index: 0,
          votes: {
            up: 1,
            down: 0,
          }
        },
        {
          username: "User2",
          comment: "Lorem ipsum",
          id: "post1comment2",
          index: 1,
          votes: {
            up: 1,
            down: 0, 
          }
        },
      ],
      index: 0,
      linkExternal: false,
      votes: {
        up: 1,
        down: 0,
      }
    },
    {
      title: "Second user submitted post",
      content: "linkplaceholder",
      id: "post2",
      comments: [
        {
          username: "User1",
          comment: "Lorem ipsum",
          id: "post2comment1",
          index: 0,
          votes: {
            up: 1,
            down: 0,
          },
        },
        {
          username: "User2",
          comment: "Lorem ipsum",
          id: "post2comment2",
          index: 1,
          votes: {
            up: 1,
            down: 0,
          },
        },
      ],
      index : 1,
      linkExternal: false,
      votes: {
        up: 1,
        down: 0,
      }
    },
    {
      title: "Third user submitted post",
      content: "linkplaceholder",
      id: "post3",
      comments: [
        {
          username: "User1",
          comment: "Lorem ipsum",
          id: "post3comment1",
          index: 0,
          votes: {
            up: 1,
            down: 0,
          }
        },
        {
          username: "User2",
          comment: "Lorem ipsum",
          id: "post3comment2",
          index: 1,
          votes: {
            up: 1,
            down: 0,
          }
        },
      ],
      index: 2,
      linkExternal: false,
      votes: {
        up: 1,
        down: 0,
      }
    },
    {
      title: "Fourth user submitted post - external link",
      content: "https://www.google.com",
      id: "post4",
      comments: [
        {
          username: "User1",
          comment: "Lorem ipsum",
          id: "post4comment1",
          index: 0,
          votes: {
            up: 1,
            down: 0,
          }
        },
        {
          username: "User2",
          comment: "Lorem ipsum",
          id: "post4comment2",
          index: 1,
          votes: {
            up: 1,
            down: 0,
          }
        },
      ],
      index: 3,
      linkExternal: true,
      votes: {
        up: 1,
        down: 0,
      }
    },
  ])

  const addPost = (title, content, external) => {
    const postObject = [{
      title: title,
      content: content,
      comments: [],
      index: listOfPosts.length,
      linkExternal: external,
      id: `post${listOfPosts.length + 1}`
    }];
    setListOfPosts(prev => prev.concat(postObject));
  }

  const addComment = (postId, currentUser, comment) => {
    let index;
    listOfPosts.forEach((post, i) => {
      if(post.id === postId) {
        index = i;
        return;
      }
    })
    const commentObj = {
      username: currentUser,
      comment: comment,
      index: listOfPosts[index].comments.length,
      id: postId + listOfPosts[index].comments.length + 1,
      votes: {
        up: 1,
        down: 0,
      }
    }
    const arrayCopy = listOfPosts.slice();
    arrayCopy[index].comments.push(commentObj);
    setListOfPosts(arrayCopy);
  }

  const registerUpvote = (index, isComment) => {
    const arrayCopy = listOfPosts.slice();
    console.log(isComment);
    if(isComment !== -1) {
      arrayCopy[index].comments[isComment.index].votes.up += 1;
    } else {
      arrayCopy[index].votes.up += 1;
    }
    setListOfPosts(arrayCopy);
  }

  const registerDownvote = (index, isComment) => {
    const arrayCopy = listOfPosts.slice();
    console.log(isComment)
    if(isComment !== -1) {
      arrayCopy[index].comments[isComment.index].votes.down += 1;
    } else {
      arrayCopy[index].votes.down += 1;
    }
    setListOfPosts(arrayCopy);
  }
  

  return <div id="PageContainer">
      <Routes>
        <Route path='/' element={<PostOverview posts={listOfPosts} upvote={registerUpvote} downvote={registerDownvote} />} />
        <Route path='/:id' element={<Comments posts={listOfPosts} addComment={addComment} upvote={registerUpvote} downvote={registerDownvote} />} />
        <Route path='/submitpost' element={<SubmitPost addPost={addPost} />}/>
      </Routes>
  </div>
}

export { PageContent };