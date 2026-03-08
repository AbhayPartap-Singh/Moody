import{useAuth} from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Protected = ({ children }) => {
  const { user , loading } = useAuth();
  const navigate = Navigate();
  
  if(loading) {
    return <div>Loading...</div>;
  }
  if(!loading && !user) {
    return navigate('/login');
  }
  
    return children;
    
  
};

export default Protected;