
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

export default function UserDetail() {
    const {id} = useParams();
    const {isLoading, error, data, refetch} = useFetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    const detail = data ?? {};
    const navigate = useNavigate();

    function handleBack() {
        navigate(-1);
    }
    function handleBackUsers() {
        navigate("/");
    }
    return (
        <section className="user-detail">
            <div className="container">
                { isLoading && (<p className='text-center'>users is loading </p>)}
                { error && (
                    <div>
                        <p className='text-center'>{error}</p>
                        <div className="flex">
                            <button onClick={handleBackUsers}>Back To Users</button>
                            <button onClick={refetch}>Retry</button>
                        </div>
                    </div>
                )}
                { !error && !isLoading && ( <button onClick={handleBack}>Back</button>) }
                {Object.keys(detail).length > 0 && ( 
                    <article>
                        <h1 className="page-title">{detail.name}</h1>
                        <ul>
                            <li>username:{detail.username}</li>
                            <li>email:{detail.email}</li>
                            <li>website:{detail.website}</li>
                            <li>phone:{detail.phone}</li>
                            <li>Company:{detail.company?.name}</li>
                        </ul>
                    </article>
                )}
            </div>
        </section>
    );
}