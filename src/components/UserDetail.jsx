
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function UserDetail() {
    const {id} = useParams();
    const [detail, setDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(()=>{
        setIsLoading(true);
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then(response => {

            if( response.status === 404) {
                throw new Error(`${response.status} : User NOt Found`)
            }
            
            if(!response.ok) {
                throw new Error("User not found");
            }
            
            return response.json();
        })
        .then(json => {
            setDetail(json);
        })
        .catch(error => {
            setError(error.message)
        })
        .finally(()=>{
            setIsLoading(false)
        })
    },[id]);

    return (
        <section className="user-detail">
            <div className="container">
                { isLoading && (<p className='text-center'>users is loading </p>)}
                { error && (<p className='text-center'>{error}</p>)}
                <Link to="/">Back</Link>
                {detail && ( 
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