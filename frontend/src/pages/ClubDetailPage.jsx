import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api';
import styles from './ClubDetailPage.module.css';

const ClubDetailPage = () => {
    const { clubId } = useParams();
    const [club, setClub] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const { user, addFavorite, removeFavorite } = useAuth();
    const isFavorited = user?.favoriteClubIds?.includes(Number(clubId));
    const isManager = user?.username === club?.manager?.username;

    useEffect(() => {
        const fetchClubDetail = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/clubs/${clubId}`);
                setClub(response.data);
            } catch (err) {
                setError('동아리 정보를 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClubDetail();
        if (club?.post) {
            setPostTitle(club.post.title);
            setPostContent(club.post.content);
        }
    }, [clubId]);
    const handleFavoriteClick = () => {
        if (isFavorited) {
            removeFavorite(Number(clubId));
        } else {
            addFavorite(Number(clubId));
        }
    };
    const handleUpdatePost = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/api/clubs/${clubId}/post`, {
                title: postTitle,
                content: postContent
            });
            setClub(response.data);
            setIsEditing(false);
            alert('게시물이 수정되었습니다.');
        } catch (error) {
            alert('수정에 실패했습니다.');
        }
    };
    if (isLoading) return <div className={styles.message}>정보를 불러오는 중...</div>;
    if (error) return <div className={styles.message}>{error}</div>;
    if (!club) return <div className={styles.message}>해당 동아리 정보가 없습니다.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img src={club.imageUrl} alt={`${club.name} 배너`} className={styles.bannerImage} />
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>{club.name}</h1>
                    <div className={styles.tags}>
                        <span className={styles.categoryTag}>{club.category}</span>
                        {club.recruiting ? (
                            <span className={`${styles.statusTag} ${styles.recruiting}`}>모집중</span>
                        ) : (
                            <span className={`${styles.statusTag} ${styles.closed}`}>모집마감</span>
                        )}
                    </div>
                    <button 
                        onClick={handleFavoriteClick} 
                        className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ''}`}
                    >
                        ♥ {isFavorited ? '즐겨찾기됨' : '즐겨찾기'}
                    </button>
                </div>
            </div>

            <div className={styles.contentBody}>
                <h2>동아리 소개</h2>
                <p className={styles.description}>{club.description}</p>
            </div>
            
            <div className={styles.actions}>
                <button className={styles.applyButton}>지원하기</button>
                <Link to="/" className={styles.backButton}>목록으로</Link>
            </div>
            {isManager && !isEditing && (
                <button onClick={() => setIsEditing(true)}>게시물 수정</button>
            )}
            {isManager && isEditing && (
                <form onSubmit={handleUpdatePost}>
                    <h3>게시물 수정</h3>
                    <input type="text" value={postTitle} onChange={e => setPostTitle(e.target.value)} />
                    <textarea value={postContent} onChange={e => setPostContent(e.target.value)} />
                    <button type="submit">저장</button>
                    <button type="button" onClick={() => setIsEditing(false)}>취소</button>
                </form>
            )}
        </div>
    );
};

export default ClubDetailPage;