import { useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

// export default function Logout() {
//   const { setUser, unsetUser } = useContext(UserContext);

//   useEffect(() => {
//     unsetUser();
//     setUser({
//       id: null,
//       isAdmin: null
//     });

//   }, []);
export default function Logout() {
  const { unsetUser } = useContext(UserContext);

  useEffect(() => {
    unsetUser(); 
  }, []);

  return <Navigate to='/login' />;
}
