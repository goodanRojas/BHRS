// AvatarCollage.jsx
export default function AvatarCollage({ users = [] }) {
    const filledUsers = [...users];

    // Fill up to 3 users with blanks if needed
    while (filledUsers.length < 3) {
        filledUsers.push({ id: `empty-${filledUsers.length}`, avatar: null, name: "Unknown" });
    }

    return (
        <div className="relative w-10 h-10">
            {filledUsers.slice(0, 3).map((user, i) => (
                <img
                    key={user.id}
                    src={user.avatar ? `/storage/${user.avatar}` : '/storage/profile/default-avatar.png'}
                    alt={user.name || 'Unknown'}
                    className={`absolute w-6 h-6 rounded-full border-2 border-white object-cover ${
                        i === 0 ? 'top-0 left-0' :
                        i === 1 ? 'top-0 right-0' :
                        'bottom-0 left-1/2 -translate-x-1/2'
                    }`}
                />
            ))}
        </div>
    );
}
