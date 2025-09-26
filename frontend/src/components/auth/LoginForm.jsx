import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../pages/AuthPage.module.css';

const LoginForm = ({ onToggle }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
        } catch (error) {
            alert('로그인에 실패했습니다.');
            console.error(error);
        }
    };

    return (
        <div>
            <h2 className={styles.title}>로그인</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="사용자 이름"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    required
                />
                <button type="submit" className={styles.button}>
                    로그인
                </button>
            </form>
            <div className={styles.toggleContainer}>
                <span>계정이 없으신가요? </span>
                <button onClick={onToggle} className={styles.toggleButton}>
                    회원가입
                </button>
            </div>
        </div>
    );
};

export default LoginForm;