import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { SubscribeToSub } from "./SubscribeToSub";

function Sidebar({ isLoggedIn, subid }) {
  const [subData, setSubData] = useState(null);
  const [refreshData, setRefreshData] = useState(null);

  useEffect(() => {
    const getSubData = async () => {
      const subRef = collection(db, "subreplicas");
      const subQuery = query(subRef, where("subreplicaName", "==", `${subid}`));
      const subSnapshot = await getDocs(subQuery);
      subSnapshot.forEach((doc) => {
        setSubData(() => ({
          localDate: doc.data().created.toDate(),
          id: doc.id,
          ...doc.data(),
        }));
      });
      setRefreshData(false);
    };
    if (subData === null || refreshData === true) {
      getSubData();
    }
  }, [subData, subid, refreshData]);

  return (
    <div
      className="sidebar-container"
      style={{ display: "grid", gridRow: "4/5" }}
    >
      {subData ? (
        <>
          <div>{subData.subreplicaName}</div>
          <div>members: {subData.members}</div>
        </>
      ) : null}
      {subData ? (
        <SubscribeToSub
          isLoggedIn={isLoggedIn}
          subData={subData}
          setRefreshData={setRefreshData}
        />
      ) : null}
    </div>
  );
}

export { Sidebar };
