import { collection, getDoc, doc, setDoc} from 'firebase/firestore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';

function CreateSubreplica({isLoggedIn}) {
  const navigate = useNavigate();
  const [subreplica, setSubreplica] = useState('');
  const [FormMesssage, setFormMessage] = useState(false);

  const validateAndCreateSubreplica = async (e) => {
    e.preventDefault();
    if(containsWhitespace()) {
      setFormMessage('Name cannot contain whitespaces');
      return;
    }
    const subsRef = collection(db, 'subreplicas');
    const subSnap = await getDoc(doc(subsRef, `${subreplica}`));
    if(!subSnap.exists()) {
      setDoc(doc(subsRef, `${subreplica}`), {
        creator: isLoggedIn.displayName,
      });
      navigate(`/r/${subreplica}/`, {replace: true});
      setFormMessage('success');
    } else {
      setFormMessage('subreplica already exists');
    }
  }

  const containsWhitespace = () => {
    if((/^\S{2,}$/.test(subreplica))) {
      return false;
    } else {
      return true;
    }
  }

  return <div className='createSubContainer'>
    <form onSubmit={(e) => validateAndCreateSubreplica(e)}>
      <input type="text" placeholder='Subreplica name' value={subreplica} onChange={(e) => {setSubreplica(e.target.value)}} disabled={!isLoggedIn} maxLength="40" minLength="2"></input>
      <button type='submit'>Submit</button>
      <div>{FormMesssage}</div>
    </form>
  </div>
}

export { CreateSubreplica };