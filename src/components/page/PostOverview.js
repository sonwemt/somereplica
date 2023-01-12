import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import "../../styles/postoverview.css";
import { PostCard } from "./PostCard";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { SubList } from "./SubList";
import { SortDropdown } from "./SortDropdown";
import { Sidebar } from "./Sidebar";

const postsPerPage = 8;

function PostOverview({ isLoggedIn }) {
  const { subid } = useParams();
  const [invalidLink, setInvalidLink] = useState(false);
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [lastPage, setlastPage] = useState(1);
  const [firstVisible, setFirstVisible] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const [sortFilter, setSortFilter] = useState({ score: false, order: "desc" });
  const [postsFetched, setPostsFetched] = useState(false);

  const updatePosts = (snapshot, reverse = false) => {
    let tempArray = [];
    setPosts(() => []);
    snapshot.forEach((doc) => {
      tempArray.push({
        id: doc.id,
        localDate: doc.data().created.toDate(),
        ...doc.data(),
      });
    });
    if (reverse) {
      tempArray.reverse();
      setPosts(() => tempArray);
    } else {
      setPosts(() => tempArray);
    }
    setPostsFetched(() => true);
  };

  useEffect(() => {
    const getFirstPage = async () => {
      const postRef = collection(db, "posts");
      let postQuery;
      let countQuery;
      let postQueryParameters = [];

      if (subid === undefined) {
        countQuery = postRef;

        if (sortFilter.score) {
          postQueryParameters.push(orderBy("score", sortFilter.order));
        }
        postQueryParameters.push(
          orderBy("created", sortFilter.score ? "desc" : sortFilter.order)
        );
        postQueryParameters.push(limit(postsPerPage));
      } else {
        const subSnap = await getCountFromServer(
          query(
            collection(db, "subreplicas"),
            where("subreplicaName", "==", `${subid}`)
          )
        );
        if (subSnap.data().count) {
          countQuery = query(postRef, where("subreplica", "==", `${subid}`));

          postQueryParameters.push(where("subreplica", "==", `${subid}`));
          if (sortFilter.score) {
            postQueryParameters.push(orderBy("score", sortFilter.order));
          }
          postQueryParameters.push(
            orderBy("created", sortFilter.score ? "desc" : sortFilter.order)
          );
          postQueryParameters.push(limit(postsPerPage));
        } else {
          setInvalidLink(true);
          console.log("subreplica not found");
          return;
        }
      }

      const postCount = await getCountFromServer(countQuery);
      if (postCount.data().count <= postsPerPage) {
        setNoMorePosts(true);
      } else {
        setNoMorePosts(false);
      }

      postQuery = query(postRef, ...postQueryParameters);

      const snapshot = await getDocs(postQuery);
      setFirstVisible(snapshot.docs[0]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      updatePosts(snapshot);
    };

    setPostsFetched(() => false);
    getFirstPage();

    setlastPage(1);
    setNextPage(1);
    console.log("subid change");
  }, [subid, sortFilter]);

  useEffect(() => {
    const incrementPage = async () => {
      const postRef = collection(db, "posts");
      let postQuery;
      let countQuery;
      let postQueryParameters = [];

      if (subid === undefined) {
        countQuery = postRef;

        if (sortFilter.score) {
          postQueryParameters.push(orderBy("score", sortFilter.order));
        }
        postQueryParameters.push(
          orderBy("created", sortFilter.score ? "desc" : sortFilter.order)
        );
      } else {
        countQuery = query(postRef, where("subreplica", "==", `${subid}`));

        postQueryParameters.push(where("subreplica", "==", `${subid}`));
        if (sortFilter.score) {
          postQueryParameters.push(orderBy("score", sortFilter.order));
        }
        postQueryParameters.push(
          orderBy("created", sortFilter.score ? "desc" : sortFilter.order)
        );
      }

      if (sortFilter.score) {
        postQueryParameters.push(
          startAfter(lastVisible.data().score, lastVisible.data().created)
        );
      } else {
        postQueryParameters.push(startAfter(lastVisible.data().created));
      }
      postQueryParameters.push(limit(postsPerPage));

      postQuery = query(postRef, ...postQueryParameters);

      const snapshot = await getDocs(postQuery);
      const postCount = await getCountFromServer(countQuery);
      console.log(nextPage * postsPerPage);
      if (postCount.data().count <= nextPage * postsPerPage) {
        setNoMorePosts(true);
      } else {
        setNoMorePosts(false);
      }
      updatePosts(snapshot);
      setFirstVisible(snapshot.docs[0]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setlastPage(nextPage);
    };

    const decrementPage = async () => {
      const postRef = collection(db, "posts");
      let postQuery;
      let countQuery;
      let postQueryParameters = [];

      if (subid === undefined) {
        countQuery = postRef;

        if (sortFilter.score) {
          postQueryParameters.push(
            orderBy("score", sortFilter.order === "asc" ? "desc" : "asc")
          );
        }
        postQueryParameters.push(
          orderBy(
            "created",
            sortFilter.score
              ? "asc"
              : sortFilter.order === "asc"
              ? "desc"
              : "asc"
          )
        );
      } else {
        countQuery = query(postRef, where("subreplica", "==", `${subid}`));

        postQueryParameters.push(where("subreplica", "==", `${subid}`));
        if (sortFilter.score) {
          postQueryParameters.push(
            orderBy("score", sortFilter.order === "asc" ? "desc" : "asc")
          );
        }
        postQueryParameters.push(
          orderBy(
            "created",
            sortFilter.score
              ? "asc"
              : sortFilter.order === "asc"
              ? "desc"
              : "asc"
          )
        );
      }
      if (sortFilter.score) {
        postQueryParameters.push(
          startAfter(firstVisible.data().score, firstVisible.data().created)
        );
      } else {
        postQueryParameters.push(startAfter(firstVisible.data().created));
      }
      postQueryParameters.push(limit(postsPerPage));

      postQuery = query(postRef, ...postQueryParameters);
      const postCount = await getCountFromServer(countQuery);
      if (postCount.data().count <= nextPage * postsPerPage) {
        setNoMorePosts(true);
      } else {
        setNoMorePosts(false);
      }
      const snapshot = await getDocs(postQuery);
      setFirstVisible(snapshot.docs[snapshot.docs.length - 1]);
      setLastVisible(snapshot.docs[0]);
      updatePosts(snapshot, true);
      setlastPage(nextPage);
    };

    if (nextPage > lastPage) {
      setPostsFetched(() => false);
      incrementPage();
    } else if (nextPage < lastPage) {
      setPostsFetched(() => false);
      decrementPage();
    }
  }, [nextPage, lastPage, subid, lastVisible, firstVisible, sortFilter]);

  return (
    <div id="PostContainer">
      <h1 className="sub-header">
        {subid === undefined ? "Frontpage" : subid}
      </h1>
      <SortDropdown sortFilter={sortFilter} setSortFilter={setSortFilter} />
      {subid === undefined ? (
        <SubList className="list-of-subs" />
      ) : (
        <Sidebar isLoggedIn={isLoggedIn} subid={subid} />
      )}
      {invalidLink ? (
        <Navigate to="/page-not-found" />
      ) : isLoggedIn ? (
        <>
          {subid === undefined ? null : (
            <Link to={`/r/${subid}/submitpost`} className="submit-link">
              Submit
            </Link>
          )}
          <Link to="/createsubreplica" className="replica-link">
            Create Subreplica
          </Link>
        </>
      ) : (
        <div>Log in or sign up to submit posts</div>
      )}
      <ul className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => {
            return (
              <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
            );
          })
        ) : postsFetched ? (
          <div>No posts yet, be the first!</div>
        ) : (
          <div>loading</div>
        )}
        {postsFetched ? (
          <div className="post-navigation">
            <button
              onClick={() => setNextPage(nextPage - 1)}
              disabled={nextPage <= 1}
            >
              Prev
            </button>

            <button
              onClick={() => setNextPage(nextPage + 1)}
              disabled={noMorePosts && nextPage === lastPage}
            >
              Next
            </button>
          </div>
        ) : null}
      </ul>
    </div>
  );
}

export { PostOverview };
