import { Link } from 'react-router-dom';
import styles from './ClubCard.module.css';

const ClubCard = ({ club }) => {
    return (
        <Link to={`/club/${club.id}`} className={styles.cardLink}>
            <div className={styles.card}>
                <img src={club.imageUrl} alt={`${club.name} 로고`} className={styles.cardImage} />
                <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>{club.name}</h3>
                        <span className={styles.cardCategory}>{club.category}</span>
                    </div>
                    <p className={styles.cardDescription}>{club.description}</p>
                    <div className={styles.cardFooter}>
                        <div className={styles.favorite}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>
                            <span>{club.favoriteCount}</span>
                        </div>
                        {club.recruiting ? (
                            <span className={`${styles.status} ${styles.recruiting}`}>모집중</span>
                        ) : (
                            <span className={`${styles.status} ${styles.closed}`}>모집마감</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ClubCard;