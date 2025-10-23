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
    
    const { user } = useAuth();
    const isManager = user?.username && club?.manager?.username === user.username;

    useEffect(() => {
        const fetchClubDetail = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/clubs/${clubId}`);
                setClub(response.data);
                if (response.data.post) {
                    setPostTitle(response.data.post.title);
                    setPostContent(response.data.post.content);
                } else {
                    setPostTitle('');
                    setPostContent('');
                }
            } catch (err) {
                setError('동아리 정보를 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClubDetail();
    }, [clubId]);

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/api/clubs/${clubId}/post`, {
                title: postTitle,
                content: postContent
            });
            setClub(response.data); 
            setIsEditing(false);
            console.log('게시물이 수정되었습니다.');
        } catch (error) {
            console.error('수정에 실패했습니다:', error);
            setError('게시물 수정에 실패했습니다.');
        }
    };

    if (isLoading) return <div className={styles.message}>정보를 불러오는 중...</div>;
    if (error) return <div className={styles.message}>{error}</div>;
    if (!club) return <div className={styles.message}>해당 동아리 정보가 없습니다.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h1 className={styles.title}>{club.name}</h1>
                    <div className={styles.tags}>
                        {club.category == "HOBBY" ? (
                                                    <span className={styles.categoryTag}>취미</span>
                                                ) : (
                                                    <span className={styles.categoryTag}>학술</span>
                                                )}
                        {club.recruiting ? (
                            <span className={`${styles.statusTag} ${styles.recruiting}`}>모집중</span>
                        ) : (
                            <span className={`${styles.statusTag} ${styles.closed}`}>모집마감</span>
                        )}
                    </div>
                </div>

                <div className={styles.cardBody}>
                    {isEditing ? (
                        <form onSubmit={handleUpdatePost} className={styles.editForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="postTitle">게시물 제목</label>
                                <input
                                    id="postTitle"
                                    type="text"
                                    value={postTitle}
                                    onChange={e => setPostTitle(e.target.value)}
                                    placeholder="홍보 게시물 제목을 입력하세요"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="postContent">게시물 내용</label>
                                <textarea
                                    id="postContent"
                                    rows="10"
                                    value={postContent}
                                    onChange={e => setPostContent(e.target.value)}
                                    placeholder="홍보 게시물 내용을 입력하세요"
                                />
                            </div>
                            <div className={styles.formActions}>
                                <button type="button" onClick={() => setIsEditing(false)} className={`${styles.button} ${styles.buttonSecondary}`}>
                                    취소
                                </button>
                                <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
                                    저장
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className={styles.postContent}>
                            {club.post ? (
                                <>
                                    <h2 className={styles.postTitle}>{club.post.title}</h2>
                                    <p className={styles.postBody}>{club.post.content}</p>
                                </>
                            ) : (
                                <p className={styles.noPost}>
                                    아직 작성된 홍보 게시물이 없습니다.
                                    {isManager && " '게시물 수정' 버튼을 눌러 작성해주세요."}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.cardFooter}>
                    <Link to="/" className={`${styles.button} ${styles.buttonSecondary}`}>
                        목록으로
                    </Link>
                    {isManager && !isEditing && (
                        <button onClick={() => setIsEditing(true)} className={`${styles.button} ${styles.buttonPrimary}`}>
                            게시물 수정
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClubDetailPage;