import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { Comment } from "./Comment";

function CommentThread({ comment, isLoggedIn, sortFilter }) {
  const [commentThread, setCommentThread] = useState(null);
  const [repliesAdded, setRepliesAdded] = useState(false);

  useEffect(() => {
    const updateReplies = (snapshot) => {
      let tempArray = [structuredClone(comment)];
      console.log(tempArray);
      snapshot.forEach((doc) => {
        tempArray.push({
          id: doc.id,
          parentid: doc.ref.parent.parent.id,
          children: [],
          localDate: doc.data().created.toDate(),
          ...doc.data(),
        });
      });

      // https://stackoverflow.com/a/36829986
      let commentAndReplies = tempArray;

      const commentMap = {};

      // move all the comments into a map of id => comment
      commentAndReplies.forEach(
        (comment) => (commentMap[comment.id] = comment)
      );

      // iterate over the comments again and correctly nest the children
      commentAndReplies.forEach((comment) => {
        if (comment.isReplyToID !== false) {
          const parent = commentMap[comment.isReplyToID];
          (parent.children = parent.children || []).push(comment);
        }
      });

      // filter the list to return a list of correctly nested comments
      const nestedComments = commentAndReplies.filter((comment) => {
        return comment.isReplyToID === false;
      });

      setCommentThread(() => nestedComments[0]);
      setRepliesAdded(true);
    };

    const getReplies = async () => {
      const postRef = doc(db, "posts", `${comment.parentid}`);
      let replyQueryParameters = [];
      replyQueryParameters.push(
        where("commentType", "array-contains", `${comment.id}`)
      );
      if (sortFilter.score) {
        replyQueryParameters.push(orderBy("score", sortFilter.order));
      }
      replyQueryParameters.push(
        orderBy("created", sortFilter.score ? "desc" : sortFilter.order)
      );

      const replyQuery = query(
        collection(postRef, "comments"),
        ...replyQueryParameters
      );
      const replySnap = await getDocs(replyQuery);

      updateReplies(replySnap);
    };

    if (!repliesAdded) {
      getReplies();
    }
  }, [repliesAdded, sortFilter, comment]);

  return commentThread ? (
    <Comment comment={commentThread} isLoggedIn={isLoggedIn} />
  ) : null;
}

export { CommentThread };
