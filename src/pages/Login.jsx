import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { useAuth } from '../contexts/AuthContext';

function Login(props) {
    const { resetSessionTimer, setAuthenticated } = useAuth();  // Add this line
    const [errors, setErrors] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [logininfo, setLoginInfo] = useState({
        username: '',
        password: '',
        keyword: ''
    });

    const navigate = useNavigate();

    const handlechange = (e) => {
        const { name, value } = e.target;
        setLoginInfo({ ...logininfo, [name]: value });
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors("");
        const { username, password } = logininfo;
        if (!username.trim() || !password.trim()) {
            setErrors("Username and password are required");
            props.showAlert("Username and password are required", "danger");
            return;
        }

        try {
            setIsLoading(true);

            // getting ip address
            const resIP = await fetch(`${import.meta.env.VITE_APP_HOST}/gs/api/v1/core/ip`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include"
            });
            if (!resIP.ok) {
                setErrors("Network error: Could not get secure connection");
            }
            const ip = await resIP.json();
            const ipAdr = ip.data;

            const encryptedUsername = CryptoJS.AES.encrypt(username, ipAdr).toString();
            const encryptedPassword = CryptoJS.AES.encrypt(password, ipAdr).toString();

            const url = `${import.meta.env.VITE_APP_HOST}/gs/api/v1/users/sign_in`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uname: encryptedUsername,
                    upassword: encryptedPassword,
                    keyword: ipAdr
                }),
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Authentication failed");
            }

            const result = await response.json();

            if (result.success) {
                localStorage.setItem('accessToken', result.data.accessToken);

                props.showAlert("Login Successfull.", "success")
                // Update authentication state
                setAuthenticated(true);

                if (setAuthenticated) {
                    setAuthenticated(true);
                }
                resetSessionTimer();
                navigate('/vault', { replace: true });
            } else {
                const errorMsg = result.message || "Invalid username or password";
                setErrors(errorMsg);
                props.showAlert(errorMsg, "danger");
            }
        } catch (error) {
            console.error("Encounter some error :", error);
            const errorMsg = "Connection error. Please try again.";
            setErrors(errorMsg);
            props.showAlert(errorMsg, "danger");
        } finally {
            setLoginInfo({
                username: "",
                password: ""
            })
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="flex items-center justify-center bg-gradient-to-br py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 p-10 rounded-2xl shadow-lg">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-400">Sign in to your account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Or{' '}
                            <Link to="/signup" className="font-medium text-gray-500 hover:text-gray-50 transition">
                                create a new account
                            </Link>
                        </p>
                    </div>
                    {errors.general && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{errors.general}</span>
                        </div>
                    )}
                    <form className="mt-8 space-y-6"
                        onSubmit={handleLogin}
                    >
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="username"
                                    onChange={handlechange}
                                    value={logininfo.username}
                                    disabled={isLoading}
                                    className={`appearance-none relative block w-full px-3 py-3 border placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="harshoslive"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    onChange={handlechange}
                                    value={logininfo.password}
                                    disabled={isLoading}
                                    className={`appearance-none relative block w-full px-3 py-3 border placeholder-gray-700 text-gray-400 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {errors && (
                                // props.showAlert(errors, "danger")
                                <div className="border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <span className="block sm:inline">{errors}</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-yellow-950 hover:bg-yellow-900 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : 'Sign in'}
                            </button>
                        </div>
                    </form>
                    <button
                            className="flex items-center justify-center w-full px-4 py-2 mt-4 text-white bg-gray-800 rounded hover:bg-gray-700"
                            onClick={() => window.location.href = `${import.meta.env.VITE_APP_HOST}/gs/api/v1/users/auth/github`}
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                {/* <!-- GitHub icon path --> */}
                                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.647.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.103-.253-.447-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.026 1.592 1.026 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                            </svg>
                            Sign in with GitHub
                        </button>
                </div>
            </div>
        </>
    )
}

export default Login;