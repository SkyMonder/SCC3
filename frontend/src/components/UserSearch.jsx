
import { useState } from 'react';
import axios from 'axios';

export default function UserSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = async () => {
    const res = await axios.get(`http://localhost:5000/users/search?q=${query}`);
    setResults(res.data);
  };

  return (
    <div>
      <input type='text' placeholder='Search user...' value={query} onChange={e=>setQuery(e.target.value)} className='border p-2'/>
      <button onClick={search} className='ml-2 p-2 bg-blue-500 text-white rounded'>Search</button>
      <ul>
        {results.map(u => <li key={u.id}><button onClick={()=>onSelect(u.id)}>{u.username}</button></li>)}
      </ul>
    </div>
  );
}
