import { useState, useEffect } from 'react';
import api from '../api';
import ClubCard from '../components/clubs/ClubCard';
import styles from './MainPage.module.css';

const MainPage = () => {
    const [clubs, setClubs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await api.get('/api/clubs');
                setClubs(response.data);
            } catch (err) {
                setError('동아리 목록을 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClubs();
    }, []);

    if (isLoading) return <div className={styles.message}>동아리 목록을 불러오는 중...</div>;
    if (error) return <div className={styles.message}>{error}</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>전체 동아리 목록</h1>
            <div className={styles.clubList}>
                {clubs.map(club => (
                    <ClubCard key={club.id} club={club} />
                ))}
            </div>
        </div>
    );
};

export default MainPage;