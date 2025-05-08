import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // Adjust based on your auth context path

function AuthSuccess() {
    const navigate = useNavigate();
    const { setAuthenticated, user, handleGithubLogin } = useAuth();

    useEffect(() => {
        const handleAuthSuccess = async () => {
            try {
                // Get token from URL query parameters
                const params = new URLSearchParams(location.search);
                const token = params.get('token');

                if (token) {
                    // Use the handleGithubLogin function from AuthContext
                    handleGithubLogin(token);
                    navigate('/vault');
                }
                else {
                    // Fetch user data using the token that was set as a cookie
                    const response = await fetch(`${import.meta.env.VITE_APP_HOST}/gs/api/v1/users/getme`, {
                        method: 'GET',
                        credentials: 'include', // Important: this sends cookies with the request
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Authentication failed');
                    }

                    const userData = await response.json();

                    // Update auth context with user data
                    if (userData.success && userData.data.accessToken) {
                        handleGithubLogin(userData.data.accessToken);
                        setAuthenticated(true);
                        setUser(userData.data);
                        navigate('/vault');
                    } else {
                        throw new Error('No token provided');
                    }
                }
            } catch (error) {
                navigate('/vault');
            }
        };

        handleAuthSuccess();
    }, [navigate, handleGithubLogin, user]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="p-8 rounded shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">Authentication Successful</h2>
                <p className="mb-4">Logging you in...</p>
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-800 mx-auto"></div>
            </div>
        </div>
    );
}

export default AuthSuccess;