import React, { useState } from 'react';

function StrengthCheck() {
    const [realTimeCheck, setRealTimeCheck] = useState("")
    const [showPassword, setShowPassword] = useState("")
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState({
        score: "",
        rating: "",
        feedback: ""
    })
    const [error, setError] = useState("")

    const handleStrengthCheck = async () => {
        if (!password) {
            setError("Please enter password")
        }
        try {
            const url = `${import.meta.env.VITE_APP_HOST}/gs/api/v1/core/pass-strength`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            })

            const data = await response.json();
            if (data.success) {
                setStrength({
                    score: data.data.score,
                    rating: data.data.rating,
                    feedback: data.data.feedback
                })
            } else {
                setError("Try again");
            }
        } catch (error) {
            setError("Some thing try again");
        }
    }

    return (
        <div className="flex items-center justify-center flex-col lg:flex-row mt-5 gap-10 py-3">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-3xl sm:text-3xl font-bold text-gray-400 mb-2">Password Strength Analyzer</h2>
                <p className="text-gray-600">Test your password against security standards</p>
            </div>

            <div className="rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
                <div className="mb-6">
                    <label htmlFor="password-strength" className="block text-sm font-medium text-gray-400 mb-2">
                        Enter Password to Analyze
                    </label>
                    <div className="relative">
                        <input
                            id="password-strength"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (realTimeCheck) {
                                    handleStrengthCheck();
                                }
                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {showPassword ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                ) : (
                                    <>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center mt-2">
                        <input
                            id="real-time-check"
                            type="checkbox"
                            checked={realTimeCheck}
                            onChange={() => setRealTimeCheck(!realTimeCheck)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="real-time-check" className="ml-2 text-sm text-gray-700">
                            Enable real-time checking
                        </label>
                    </div>
                </div>

                {/* Strength Indicator */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-400">Password Strength</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full 
                            ${strength.score >= 80 ? 'text-green-600' :
                                strength.score >= 60 ? 'text-green-700' :
                                    strength.score >= 40 ? 'text-yellow-600' :
                                        'text-red-600'
                            }`}>
                            {strength.rating}
                        </span>
                    </div>
                    <div className="w-full bg-amber-300 rounded-full h-2.5 mb-2">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-300 ${strength.score >= 80 ? 'bg-green-600' :
                                strength.score >= 60 ? 'bg-green-700' :
                                    strength.score >= 40 ? 'bg-yellow-600' :
                                        'text-red-600'
                                }`}
                            style={{ width: `${strength.score}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 text-right">
                        Score: {strength.score}/100
                    </p>
                </div>

                {/* Feedback */}
                {strength.feedback && strength.feedback.length > 0 && (
                    <div className={`p-4 rounded-lg mb-6 ${strength.score >= 80 ? 'border-l-4 border-green-500' :
                        strength.score >= 60 ? 'border-l-4 border-blue-500' :
                            strength.score >= 40 ? 'border-l-4 border-yellow-500' :
                                'border-l-4 border-red-500'
                        }`}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                {strength.score >= 80 ? (
                                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : strength.score >= 60 ? (
                                    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium">
                                    {strength.score >= 80 ? 'Excellent!' :
                                        strength.score >= 60 ? 'Good' :
                                            strength.score >= 40 ? 'Could be stronger' : 'Weak password'}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleStrengthCheck}
                    disabled={!password}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${!password ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed`}
                >
                    Analyze Password
                </button>

                <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">Password Strength Guidelines</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Minimum 12 characters
                        </li>
                        <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Mix of uppercase & lowercase
                        </li>
                        <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Include numbers and symbols
                        </li>
                        <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Avoid common patterns
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default StrengthCheck;