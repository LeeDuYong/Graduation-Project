import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
const ProfilePage = () => {
    const { user } = useAuth();
    return (
        <div style={{ padding: '2rem' }}>
            <h1>내 프로필 페이지</h1>
            <p>사용자 정보:</p>
            <ul>
                <li>Username: {user?.username}</li>
                <li>Role: {user?.role}</li>
            </ul>
        </div>
    );
};

export default ProfilePage;