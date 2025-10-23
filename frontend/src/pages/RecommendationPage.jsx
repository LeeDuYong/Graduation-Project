import { useState } from 'react';
import api from '../api';
import styles from './RecommendationPage.module.css';
import ReactMarkdown from 'react-markdown';

const RecommendationPage = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        setIsLoading(true);
        setResponse('');
        setError(null);
        try {
            const result = await api.post('/api/recommend', { query });
            setResponse(result.data);
        } catch (error) {
            setError('추천을 생성하는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>AI 동아리 추천 🤖</h1>
            <p>찾고 있는 동아리에 대해 자유롭게 질문해보세요!</p>
            <p className={styles.example}>예: "코딩도 배우고 사람들과 친해질 수 있는 동아리 찾아줘"</p>
            
            <form onSubmit={handleSubmit} className={styles.form}>
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="여기에 질문을 입력하세요..."
                    rows="3"
                    className={styles.textarea}
                />
                <button type="submit" disabled={isLoading} className={styles.button}>
                    {isLoading ? '생각 중...' : '추천받기'}
                </button>
            </form>

            {isLoading && <div className={styles.loading}>AI가 열심히 동아리를 찾고 있어요...</div>}
            {error && <div className={styles.error}>{error}</div>}

            {response && !isLoading && (
                <div className={styles.responseCard}>
                    <ReactMarkdown>{response}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default RecommendationPage;