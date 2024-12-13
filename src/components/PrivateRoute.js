import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  console.log("PrivateRoute user:", user);
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;