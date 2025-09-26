import { useState, useEffect } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import styles from './MyClubPage.module.css';

const ManagedClubCard = ({ club, onUpdate }) => {
    
    const handleToggleRecruiting = async () => {
        const newStatus = !club.recruiting;
        try {
            const response = await api.put(`/api/clubs/${club.id}/recruiting`, { recruiting: newStatus });
            onUpdate(response.data);
            alert(`'${club.name}'의 모집 상태가 '${newStatus ? '모집중' : '모집마감'}'으로 변경되었습니다.`);
        } catch (error) {
            alert('상태 변경에 실패했습니다.');
        }
    };

    return (
        <div className={styles.managedCard}>
            <h3>{club.name}</h3>
            <div className={styles.statusSection}>
                <p>
                    상태: 
                    <span className={club.recruiting ? styles.recruiting : styles.closed}>
                        {club.recruiting ? '모집중' : '모집마감'}
                    </span>
                </p>
                <button onClick={handleToggleRecruiting} className={styles.toggleButton}>
                    {club.recruiting ? '마감하기' : '시작하기'}
                </button>
            </div>
        </div>
    );
};


const MyClubPage = () => {
    const [myClubs, setMyClubs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyClubs = async () => {
            try {
                const response = await api.get('/api/clubs/manage/my-clubs');
                setMyClubs(response.data);
            } catch (error) {
                console.error("내 동아리 목록 로딩 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyClubs();
    }, []);

    const handleClubUpdate = (updatedClub) => {
        setMyClubs(prevClubs => 
            prevClubs.map(club => club.id === updatedClub.id ? updatedClub : club)
        );
    };

    if (isLoading) return <div>로딩 중...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>내 동아리 관리</h1>
                <Link to="/create-club" className={styles.createButton}>+ 새 동아리 등록</Link>
            </div>
            
            {myClubs.length > 0 ? (
                <div className={styles.clubList}>
                    {myClubs.map(club => (
                        <ManagedClubCard key={club.id} club={club} onUpdate={handleClubUpdate} />
                    ))}
                </div>
            ) : (
                <p>아직 등록된 동아리가 없습니다. 새로 등록해주세요.</p>
            )}
        </div>
    );
};

export default MyClubPage;