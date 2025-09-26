import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkLoginStatus = useCallback(async () => {
        try {
            const userResponse = await api.get('/api/auth/me');
            const favoritesResponse = await api.get('/api/favorites/my');
            setUser({ ...userResponse.data, favoriteClubIds: favoritesResponse.data });
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        checkLoginStatus();
    }, [checkLoginStatus]);

    const login = async (username, password) => {
        const userResponse = await api.post('/api/auth/login', { username, password });
        const favoritesResponse = await api.get('/api/favorites/my');
        setUser({ ...userResponse.data, favoriteClubIds: favoritesResponse.data });
    };

    const logout = async () => {
        await api.post('/api/auth/logout');
        setUser(null);
    };

    const signup = async (username, password) => {
        await api.post('/api/auth/signup', { username, password });
    };

    const addFavorite = async (clubId) => {
        if (!user) return;
        try {
            await api.post(`/api/favorites/${clubId}`);
            setUser(prevUser => ({
                ...prevUser,
                favoriteClubIds: [...prevUser.favoriteClubIds, clubId]
            }));
        } catch (error) {
            console.error("즐겨찾기 추가 실패", error);
        }
    };

    const removeFavorite = async (clubId) => {
        if (!user) return;
        try {
            await api.delete(`/api/favorites/${clubId}`);
            setUser(prevUser => ({
                ...prevUser,
                favoriteClubIds: prevUser.favoriteClubIds.filter(id => id !== clubId)
            }));
        } catch (error) {
            console.error("즐겨찾기 삭제 실패", error);
        }
    };

    const value = {
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        logout,
        signup,
        addFavorite,
        removeFavorite
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};