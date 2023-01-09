import { collection, getDocs } from 'firebase/firestore';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig';

function SubList() {
  const [localList, setLocalList] = useState([]);
  const [subsFetched, setSubsFetched] = useState(false);

  useState(() => {
    const getSubs = async () => {
      const subRef = collection(db, 'subreplicas');
      const subSnap = await getDocs(subRef);
      let tempArray = [];
      subSnap.forEach((sub) => {
        tempArray.push({
          id: sub.id,
          ...sub.data()
        });
      })
      setLocalList(() => tempArray);
    }
    if(!subsFetched) {
      getSubs();
      setSubsFetched(true);
    }
  }, [localList])

  return <ul className='sub-list'>
    {subsFetched ? localList.map((sub) => {
      return <li key={sub.id}><Link to={`/r/${sub.subreplicaName}/`} >{sub.subreplicaName}</Link></li>
    }): null}
    </ul>
}

export { SubList };