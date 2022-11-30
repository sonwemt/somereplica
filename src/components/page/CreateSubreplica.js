import { collection, getDoc, doc, setDoc} from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../firebase';

function CreateSubreplica({isLoggedIn}) {
  const [subreplica, setSubreplica] = useState('');
  const [FormMesssage, setFormMessage] = useState(false);

  const createSubreplica = async (e) => {
    e.preventDefault();
    const subsRef = collection(db, 'subreplicas');
    const subSnap = await getDoc(doc(subsRef, `${subreplica}`));
    if(!subSnap.exists()) {
      setDoc(doc(subsRef, `${subreplica}`), {
        creator: isLoggedIn.username,
      })
      setFormMessage('success');
    } else {
      setFormMessage('subreplica already exists');
    }
  }

  return <div className='createSubContainer'>
    <form onSubmit={(e) => createSubreplica(e)}>
      <input type="text" placeholder='Subreplica name' value={subreplica} onChange={(e) => {setSubreplica(e.target.value)}} disabled={!isLoggedIn}></input>
      <button type='submit'>Submit</button>
      <div>{FormMesssage}</div>
    </form>
  </div>
}

export { CreateSubreplica };