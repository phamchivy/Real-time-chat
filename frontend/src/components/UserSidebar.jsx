// components/UserSidebar.jsx
const UserSidebar = ({ users, selectedUser, setSelectedUser }) => {
    return (
        <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: "1rem" }}>
            <h3>Danh sách người dùng</h3>
            <ul>
                {users.map((user) => (
                    <li
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        style={{
                            cursor: "pointer",
                            fontWeight: selectedUser?._id === user._id ? "bold" : "normal",
                            marginBottom: "0.5rem",
                        }}
                    >
                        {user.username} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserSidebar;
