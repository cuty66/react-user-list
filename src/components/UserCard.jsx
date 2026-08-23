import { Link } from "react-router-dom";

export default function UserCard({name, website, email, id}) {
    return (
        <div className="user-card">
            <h4 className="user-card_name"><Link to={`/users/${id}`}>{name}</Link></h4>
            <p><a href={website}>{website}</a></p>
            <p><a href={`mailto:${email}`}>{email}</a></p>
        </div>
    );
}