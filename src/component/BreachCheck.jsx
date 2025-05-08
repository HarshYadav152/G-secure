import React, {useState } from "react";
import Loader from "../utils/Loader";

export default function BreachCheck() {
    const [pass, setPass] = useState("");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState("")

    const onchange = (e) => {
        setPass(e.target.value)
    }
    const handleKeyPress = (e) => {
        // Check if Enter key was pressed
        if (e.key === "Enter" && !isLoading) {
            handleBreachCheck();
        }
    }
    const handleBreachCheck = async () => {

        if (!pass) {
            setStatus("Please enter a password to check");
            return;
        }
        setIsLoading(true);
        setStatus("");

        try {
            const url = `${import.meta.env.VITE_APP_HOST}/gs/api/v1/core/breach-check`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: pass })
            })

            if (!response.ok) {
                console.log("Try again for checking breach..");
            }
            const data = await response.json();
            if (data.success) {
                if (data.data?.compromised) {
                    setStatus("⚠️ This password has been found in data breaches. Please change it immediately!");
                } else {
                    setStatus("✅ Good news! This password hasn't been found in known data breaches.");
                }
            } else {
                setStatus("Try again")
            }
        } catch (error) {
            setStatus(`Error occured : try again.`);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-3">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-400 mb-2">Password Breach Check</h2>
                <p className="text-gray-600">Verify if your password has been exposed in data breaches</p>
            </div>

            <div className="rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
                <div className="mb-6">
                    <label htmlFor="password-check" className="block text-sm font-medium text-gray-400 mb-2">
                        Enter Password to Check
                    </label>
                    <div className="relative">
                        <input
                            id="password-check"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={pass}
                            onChange={onchange}
                            onKeyDown={handleKeyPress}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {showPassword ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                ) : (<>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </>)}
                            </svg>
                        </button>
                    </div>
                    <p className="mt-1 text-2xs text-gray-500">
                        We use secure hashing (SHA-1) to check breaches without storing your password
                    </p>
                </div>

                {status && (
                    <div className={`mb-6 p-4 rounded-lg ${status.includes('exposed') ? 'bg-red-50 border-l-4 border-red-500' :
                            status.includes('safe') ? 'bg-green-50 border-l-4 border-green-500' :
                                'bg-blue-50 border-l-4 border-blue-500'
                        }`}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                {status.includes('exposed') ? (
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : status.includes('safe') ? (
                                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3">
                                <p className={`text-sm ${status.includes('exposed') ? 'text-red-700' :
                                        status.includes('safe') ? 'text-green-700' :
                                            'text-blue-700'
                                    }`}>
                                    {status}
                                </p>
                                {status.includes('exposed') && (
                                    <p className="mt-1 text-xs text-red-600">
                                        Recommendation: Change this password immediately on all accounts where it's used
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleBreachCheck}
                    disabled={!pass || isLoading}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isLoading ? (
                        <div className="flex justify-center items-center gap-1">
                            <Loader />
                            Checking Have I Been Pwned database...
                        </div>
                    ) : (
                        'Check for Breaches'
                    )}
                </button>

                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                        Powered by <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Have I Been Pwned</a> API
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Your password is hashed locally before checking against the database
                    </p>
                </div>
            </div>
        </div>
    );
}