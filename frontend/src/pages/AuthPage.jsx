import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import styles from './AuthPage.module.css';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className={styles.container}>
            <div className={styles.authContainer}>
                {isLogin ? (
                    <LoginForm onToggle={toggleForm} />
                ) : (
                    <SignupForm onToggle={toggleForm} />
                )}
            </div>
        </div>
    );
}