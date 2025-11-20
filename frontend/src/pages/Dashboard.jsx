
import { useState } from 'react';
import UserSearch from '../components/UserSearch';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const startCall = (id) => navigate(`/call/${id}`);

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-4'>SkyCall Dashboard</h1>
      <UserSearch onSelect={startCall} />
    </div>
  );
}
