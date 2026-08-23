import { useEffect, useState } from 'react'
import UserList from '../components/UserList';

function UsersPage() {
  const [user, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    useEffect(()=>{
      setIsLoading(true);
      fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => {
        if(!response.ok) {
          throw new Error("Something went wrong !!!");
        }
        return response.json();
      })
      .then(json  => {
        setUser(json);
      })
      .catch(error => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }, [])
   
    const filteredUsers = user.filter(m => m.name.toLowerCase().includes(search.toLowerCase().trim()) );

  return (
    <section className='user-wrapper'>
      <div className="container">
        { isLoading && (<p className='text-center'>users is loading </p>)}
        { error && (<p className='text-center'>{error}</p>)}
        {!isLoading && !error && user.length === 0 && (
          <p className='text-center'>No users found.</p>
        )}
        <div className="filter">
          <div className="search-form">
            <input 
            type="text" 
            placeholder='Search...' 
            value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <UserList userLists = {filteredUsers} />

        {user.length > 0 && filteredUsers.length === 0 && (
          <p className='text-center'>Search for {search.trim()}: No users found.</p>
        )}
      </div>
    </section>
  );
}

export default UsersPage;