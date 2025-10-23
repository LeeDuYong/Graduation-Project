import { useState, useEffect } from 'react';
import api from '../api';
import ClubCard from '../components/clubs/ClubCard';
import styles from './SearchPage.module.css';

const SearchPage = () => {
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [recruiting, setRecruiting] = useState(false);

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const search = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (keyword) params.append('keyword', keyword);
                if (category) params.append('category', category);
                if (recruiting) params.append('recruiting', true);

                const response = await api.get(`/api/clubs/search?${params.toString()}`);
                setResults(response.data);
            } catch (error) {
                console.error("검색 실패:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };
        
        const delayDebounceFn = setTimeout(() => {
            search();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [keyword, category, recruiting]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>동아리 검색</h1>
            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="키워드 검색 (동아리 이름, 설명, 게시물 내용)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className={styles.searchInput}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">전체 카테고리</option>
                    <option value="ACADEMIC">학술</option>
                    <option value="HOBBY">취미</option>
                </select>
                <label>
                    <input
                        type="checkbox"
                        checked={recruiting}
                        onChange={(e) => setRecruiting(e.target.checked)}
                    />
                    모집중인 동아리만 보기
                </label>
            </div>
            
            <div className={styles.results}>
                {isLoading ? (
                    <p>검색 중...</p>
                ) : results.length > 0 ? (
                    <div className={styles.clubList}>
                        {results.map(club => (
                            <ClubCard key={club.id} club={club} />
                        ))}
                    </div>
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;