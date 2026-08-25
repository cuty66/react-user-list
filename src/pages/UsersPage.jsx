import { useEffect, useState } from 'react'
import UserList from '../components/UserList';
import useFetch from '../hooks/useFetch';

function UsersPage() {
    // const [user, setUser] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const postPerPage = 3;
    const startIndex = (currentPage - 1) * postPerPage;
    const endIndex = startIndex + postPerPage;
    const {isLoading, error, data} = useFetch("https://jsonplaceholder.typicode.com/users");
    const users = data ?? [];
    // useEffect(()=>{
    //   setIsLoading(true);
    //   fetch("https://jsonplaceholder.typicode.com/users")
    //   .then(response => {
    //     if(!response.ok) {
    //       throw new Error("Something went wrong !!!");
    //     }
    //     return response.json();
    //   })
    //   .then(json  => {
    //     setUser(json);
    //   })
    //   .catch(error => {
    //     setError(error.message);
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
    // }, []);
    const filteredUsers = users.filter(m => m.name.toLowerCase().includes(search.toLowerCase().trim()) );
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    const totalPage = Math.ceil(filteredUsers.length / postPerPage);
    

    useEffect(()=>{
        setCurrentPage(1);
    }, [search]);

    function handlePagination(page) {
        setCurrentPage(page);
    }

    function handleNextPage() {
        if(currentPage >= totalPage) return;
        setCurrentPage(currentPage+1);
    }
    function handlePrevPage() {
        if(currentPage === 1) return;
        setCurrentPage(currentPage-1);
    }
    const paginationArr = Array.from({ length: totalPage }, (_, index) => index + 1);

  return (
    <section className='user-wrapper'>
      <div className="container">
        { isLoading && (<p className='text-center'>users is loading </p>)}
        { error && (<p className='text-center'>{error}</p>)}
        {!isLoading && !error && users.length === 0 && (
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

        <UserList userLists = {currentUsers} />

        {paginationArr.length > 0 && ( 
            <ul className='pagination flex'>
                {paginationArr.length > 1 && (
                    <li>
                        <button type='button' onClick={handleNextPage} disabled={currentPage === totalPage }>Next</button>
                    </li> 
                )}
                {paginationArr.map(page => 
                    (
                    <li key={page}>
                        <button type='button' 
                        onClick={() => handlePagination(page)}
                        className={currentPage === page ? 'active' : ''}
                        >{page}</button></li>
                    )
                )}
                {paginationArr.length > 1 && (
                    <li>
                        <button type='button' onClick={handlePrevPage} disabled={currentPage===1}>Prev</button>
                    </li>
                )}
            </ul>
        )}

        {users.length > 0 && filteredUsers.length === 0 && (
          <p className='text-center'>Search for {search.trim()}: No users found.</p>
        )}
      </div>
    </section>
  );
}

export default UsersPage;