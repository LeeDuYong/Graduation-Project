import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import styles from './ClubCreationPage.module.css';

const ClubCreationPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('ACADEMIC');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await api.post('/api/clubs', {
                name,
                description,
                category,
                recruiting: true
            });
            alert('동아리가 성공적으로 생성되었습니다!');
            navigate(`/club/${response.data.id}`);
        } catch (error) {
            alert('동아리 생성에 실패했습니다. 입력 내용을 확인해주세요.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>새 동아리 등록</h1>
            <p>운영진으로 활동할 동아리의 정보를 입력해주세요.</p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">동아리 이름</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="예: FC 성균"
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description">한 줄 소개</label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="예: 성균관대학교 중앙 축구 동아리입니다."
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="category">카테고리</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="ACADEMIC">학술</option>
                        <option value="HOBBY">취미</option>
                    </select>
                </div>
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? '생성 중...' : '등록하기'}
                </button>
            </form>
        </div>
    );
};

export default ClubCreationPage;