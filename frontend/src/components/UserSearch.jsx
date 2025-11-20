import { useState } from 'react';
import axios from 'axios';

export default function UserSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = async () => {
    if (!query) return;
    try {
      // Запрос к backend на Render
      const res = await axios.get(`https://skycallpro.onrender.com/users/search?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error('Ошибка поиска пользователей:', err);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <input
        type="text"
        placeholder="Search user..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="border p-2 rounded w-2/3"
      />
      <button
        onClick={search}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Search
      </button>
      <ul className="mt-4">
        {results.map(u => (
          <li key={u.id} className="mb-2">
            <button
              onClick={() => onSelect(u.id)}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {u.username}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
