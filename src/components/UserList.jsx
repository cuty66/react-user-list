import UserCard from "./UserCard";

export default function UserList({userLists}) {
    return (
        <div className="flex">
            {userLists && userLists.map((item) => (
                <UserCard 
                key={`${item.name}-${item.id}`} 
                name={item.name} 
                website={item.website} 
                email={item.email} 
                id={item.id} />
            ))}
        </div>
    );
}