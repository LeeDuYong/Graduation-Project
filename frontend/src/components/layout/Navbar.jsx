import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
const Navbar = () => {
    const { user, logout } = useAuth();
    const isAdmin = user?.authorities?.some(auth => auth.authority === 'ROLE_ADMIN');

    const navStyle = {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 2rem', backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0'
    };
    const linkStyle = { textDecoration: 'none', color: '#333', margin: '0 1rem' };
    const buttonStyle = {
        padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white',
        border: 'none', borderRadius: '5px', cursor: 'pointer'
    };

    return (
        <nav style={navStyle}>
            <span style={{...linkStyle, fontWeight: 'bold'}}>동아리 앱</span>
            <div>
                <Link to="/" style={linkStyle}>메인</Link>
                <Link to="/search" style={linkStyle}>동아리 검색</Link>
                <Link to="/profile" style={linkStyle}>내 프로필</Link>
                {isAdmin && (
                    <Link to="/my-club" style={linkStyle}>내 동아리 관리</Link>
                )}
            </div>
            <button onClick={logout} style={buttonStyle}>로그아웃</button>
        </nav>
    );
};

export default Navbar;