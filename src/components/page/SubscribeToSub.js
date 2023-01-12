import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";

function SubscribeToSub({ isLoggedIn, subData, setRefreshData }) {
  const [subscribeStatus, setSubscribeStatus] = useState(null);

  useEffect(() => {
    const getSubscribeStatus = async () => {
      const subscriptionRef = collection(
        db,
        "users",
        `${isLoggedIn.uid}`,
        "subscriptions"
      );
      const subscriptionQuery = query(
        subscriptionRef,
        where("subreplicaName", "==", `${subData.subreplicaName}`)
      );
      const subCountQuery = await getCountFromServer(subscriptionQuery);
      if (subCountQuery.data().count > 0) {
        setSubscribeStatus(true);
      } else {
        setSubscribeStatus(false);
      }
    };
    getSubscribeStatus();
  });

  const handleClick = async () => {
    if (subscribeStatus) {
      const subscriptionRef = collection(
        db,
        "users",
        `${isLoggedIn.uid}`,
        "subscriptions"
      );
      try {
        const getSubscribeRef = await getDocs(
          query(
            subscriptionRef,
            where("subreplicaName", "==", `${subData.subreplicaName}`)
          )
        );
        getSubscribeRef.forEach((doc) => {
          deleteDoc(doc.ref);
        });

        await updateDoc(doc(db, "subreplicas", `${subData.id}`), {
          members: increment(-1),
        });

        setSubscribeStatus(() => false);
      } catch (error) {
        console.log(error);
      }
    } else {
      const subscriptionRef = collection(
        db,
        "users",
        `${isLoggedIn.uid}`,
        "subscriptions"
      );
      try {
        await addDoc(subscriptionRef, {
          subreplicaName: subData.subreplicaName,
        });
        await updateDoc(doc(db, "subreplicas", `${subData.id}`), {
          members: increment(1),
        });

        setSubscribeStatus(() => true);
      } catch (error) {
        console.log(error);
      }
    }
    setRefreshData(() => true);
  };

  return (
    <button
      className={`subscribe-button ${subscribeStatus ? "subscribed" : null}`}
      style={{
        color: `${subscribeStatus ? "white" : "black"}`,
        backgroundColor: `${subscribeStatus ? "red" : "green"}`,
        width: "fit-content",
      }}
      disabled={!isLoggedIn}
      onClick={handleClick}
    >
      {subscribeStatus ? "unsubscribe" : "subscribe"}
    </button>
  );
}

export { SubscribeToSub };
