import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { SubscribeToSub } from "./SubscribeToSub";

function Sidebar({isLoggedIn, subid}) {
  const [subData, setSubData] = useState(null);

  useEffect(() => {
    const getSubData = async () => {
      const subRef = collection(db, 'subreplicas');
      const subQuery = query(subRef, where('subreplicaName', '==', `${subid}`))
      const subSnapshot = await getDocs(subQuery);
      subSnapshot.forEach((doc) => {
        setSubData(() => ({
          localDate: doc.data().created.toDate(),
          id: doc.id,
          ...doc.data(),
        }))
      })
      
    }
    if(subData === null) {
      getSubData();
    }
  }, [subData, subid])

  return <div className="sidebar-container" style={{display: 'grid'}}>
    {subData ? subData.subreplicaName: null}
    <SubscribeToSub isLoggedIn={isLoggedIn} />
  </div>
}

export { Sidebar };