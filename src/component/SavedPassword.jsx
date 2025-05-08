import React, { useState, useEffect } from 'react';
import CryptoJS from "crypto-js";
import { Link, useNavigate } from 'react-router-dom';

function SavedPassword() {
    const [showPassword, setShowPassword] = useState({});
    const [passwords, setPasswords] = useState([]);
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // ✅ fix: useNavigate()

    const handleAdd = () => {
        navigate("/vault/add");
    };

    const handleCopyPassword = async (encryptedPassword) => {
        const keyword = prompt("Enter your decryption keyword:");
        if (!keyword) {
            alert("Keyword is required to decrypt the password.");
            return;
        }
    
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedPassword, keyword).toString(CryptoJS.enc.Utf8);
    
            if (!decrypted) {
                alert("Failed to decrypt password. Incorrect keyword.");
                return;
            }
    
            await navigator.clipboard.writeText(decrypted);
            alert("Password copied to clipboard!");
        } catch (err) {
            alert("An unexpected error occurred. Please try again.");
        }
    };
    

    const getSavedPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('accessToken');

        try {
            const url = `${import.meta.env.VITE_APP_HOST}/gs/api/v1/vault/expose-vault`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (result?.data?.count > 0 && Array.isArray(result.data.savedPass)) {
                setPasswords(result.data.savedPass);
                setStatus(result.data.message || 'Passwords loaded');
            } else {
                setPasswords([]);
                setStatus('No passwords found');
            }
        } catch (error) {
            setPasswords([]);
            setStatus('Session Expired. Login Again');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full">
            <div className="max-w-5xl mx-auto p-4 sm:p-6">
                <div className="mb-6 flex justify-between items-center flex-wrap gap-2">
                    <h2 className="text-xl font-bold text-gray-600">
                        Saved Passwords ({passwords.length})
                    </h2>
                    {status && (
                        <span className="text-green-800 text-sm px-3 py-1 rounded-full bg-green-100">
                            {status}
                        </span>
                    )}
                </div>

                {passwords.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                        {passwords.map((password) => (
                            <div
                                key={password.id}
                                className="rounded-lg shadow-md p-2 border border-yellow-600 hover:shadow-lg transition"
                            >
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-400 break-words">
                                        Website:{" "}
                                        <a
                                            href={password.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline break-all"
                                        >
                                            {password.website}
                                        </a>
                                    </h3>
                                    <p className="text-gray-400 mt-1 overflow-hidden">Username: {password.username}</p>
                                </div>

                                <div className="mb-4 relative">
                                    <input
                                        type={showPassword[password.id] ? "text" : "password"}
                                        value={password.password}
                                        readOnly
                                        className="w-full px-4 py-2 border rounded-lg font-mono text-gray-500 text-sm truncate "
                                    />
                                    <button
                                        onClick={() => handleCopyPassword(password.password)}
                                        disabled={!password}
                                        className="absolute inset-y-0 right-0 pr-3 cursor-pointer inline-flex items-center px-4 py-2 text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                    </button>
                                </div>

                                {password.notes && (
                                    <div className="mb-4 p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                                        <p className="text-sm text-yellow-900"><strong>Note:</strong> {password.notes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg shadow-md p-8 text-center">
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No passwords saved yet</h3>
                        <p className="text-gray-500 mb-4">Add your first password to get started</p>
                    </div>
                )}

                <div className="flex gap-2 mt-6 flex-wrap">
                    <button
                        className="px-6 py-2 bg-yellow-900 hover:bg-yellow-800 text-white rounded-lg transition"
                        disabled={isLoading}
                        onClick={getSavedPassword}
                    >
                        {isLoading ? "Loading..." : "Fetch Saved Passwords"}
                    </button>
                    <button
                        className="px-6 py-2 bg-yellow-900 hover:bg-yellow-800 text-white rounded-lg transition"
                        onClick={handleAdd}
                    >
                        Add Password
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SavedPassword;