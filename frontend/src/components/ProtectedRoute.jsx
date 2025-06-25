import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setLoading(false);
                navigate('/login');
                return;
            }

            try {
                const response = await axios({
                    method: 'GET',
                    url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/user/profile`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } catch (error) {
                console.log('Auth check failed:', error);
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="text-gray-600">Loading...</span>
                </div>
            </div>
        );
    }

    return isAuthenticated ? children : null;
}

export default ProtectedRoute; 