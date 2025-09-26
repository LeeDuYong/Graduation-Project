import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../pages/AuthPage.module.css';

const SignupForm = ({ onToggle }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(username, password);
            alert('회원가입이 완료되었습니다. 로그인 해주세요.');
            onToggle();
        } catch (error) {
            alert('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
            console.error('회원가입 실패:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div>
            <h2 className={styles.title}>회원가입</h2>
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
                    가입하기
                </button>
            </form>
            <div className={styles.toggleContainer}>
                <span>이미 계정이 있으신가요? </span>
                <button onClick={onToggle} className={styles.toggleButton}>
                    로그인
                </button>
            </div>
        </div>
    );
};

export default SignupForm;