import React, { useState } from "react";
import Loader from "../utils/Loader"

export default function GeneratePassword() {
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [passStrength, setPassStrength] = useState({
        score: "",
        rating: "",
        feedback: ""
    })

    const [error, setError] = useState("")
    const [requirement, setRequirement] = useState({
        plength: 15,
        keyword: ""
    });

    const onchange = (e) => {
        setRequirement({ ...requirement, [e.target.name]: e.target.value })
    }
    const generateNewPassword = async () => {
        try {
            setIsLoading(true)
            setError("")
            if (parseInt(requirement.plength) < 10) {
                setError("Minimum length should be 10");
                // return;
            }

            const url = `${import.meta.env.VITE_APP_HOST}/gs/api/v1/core/generate-pass`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ plength: parseInt(requirement.plength), keyword: requirement.keyword })
            })
            const result = await response.json();
            if (result.success) {
                if (result.data && result.data.gresponse && result.data.gresponse.password) {
                    setPassword(result.data.gresponse.password);
                    const { score, rating, feedback } = result.data.strength;
                    setPassStrength({
                        score: score,
                        rating: rating,
                        feedback: feedback
                    })
                } else if (typeof result.data.gresponse === 'string') {
                    setPassword(result.data.gresponse);
                    const { score, rating, feedback } = result.data.strength;
                    setPassStrength({
                        score: score,
                        rating: rating,
                        feedback: feedback
                    })
                } else {
                    setError("Unexpected response format from API");
                    console.error("Unexpected response format:", result);
                }
            } else {
                setError(result.message || "Failed to generate password");
            }
        } catch (error) {
            console.error("Error generating password:", error);
            setError("An error occurred while generating the password");
        } finally {
            setIsLoading(false)
            setRequirement({
                plength: 15,
                keyword: ""
            })
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-6 py-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-400 mb-2">G-Secure Password Generator</h2>
                <p className="text-gray-600">Create strong, random passwords to keep your accounts safe</p>
            </div>

            <div className="rounded-xl shadow-lg border border-gray-500 p-6 sm:p-8">
                {/* Password Display Section */}
                <div className="mb-6">
                    <label htmlFor="generated-password" className="block text-sm font-medium text-gray-400 mb-2">
                        Your Secure Password
                    </label>
                    <div className="flex rounded-lg shadow-sm">
                        <input
                            id="generated-password"
                            type="text"
                            readOnly
                            value={password || ''}
                            className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-lg border-0 font-mono text-gray-900 bg-gray-200 focus:ring-2 focus:ring-blue-500"
                            placeholder="Your password will appear here"
                        />
                        <button
                            onClick={() => {
                                if (password) {
                                    navigator.clipboard.writeText(password);
                                    // Add toast/notification here
                                }
                            }}
                            disabled={!password}
                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Configuration Options */}
                <div className="space-y-5 mb-6">
                    <div>
                        <label htmlFor="password-length" className="block text-sm font-medium text-gray-400 mb-2">
                            Password Length: <span className="font-bold">{requirement.plength}</span>
                        </label>
                        <input
                            id="password-length"
                            type="range"
                            min="12"
                            max="64"
                            name="plength"
                            value={requirement.plength}
                            onChange={onchange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>12</span>
                            <span>64</span>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="keyword" className="block text-sm font-medium text-gray-400 mb-2">
                            Include Keyword
                        </label>
                        <input
                            id="keyword"
                            type="text"
                            name="keyword"
                            value={requirement.keyword}
                            onChange={onchange}
                            required
                            className="block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="favourite word"
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Strength Indicator */}
                {password &&
                    <div className="space-y-2">
                        {/* Strength Label */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-400">Password Strength</span>
                            <span className={`text-sm font-semibold ${passStrength.score >= 80 ? 'text-green-600' :
                                passStrength.score >= 60 ? 'text-green-700' :
                                    passStrength.score >= 40 ? 'text-yellow-600' :
                                        'text-red-600'
                                }`}>
                                {passStrength.rating}
                            </span>
                        </div>

                        {/* Strength Bar */}
                        <div className="w-full rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${passStrength.score >= 80 ? 'bg-green-200' :
                                    passStrength.score >= 60 ? 'bg-green-700' :
                                        passStrength.score >= 40 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                    }`}
                                style={{ width: `${passStrength.score}%` }}
                            ></div>
                        </div>

                        {/* Feedback Messages */}
                        {passStrength.feedback && passStrength.feedback.length > 0 && (
                            <div className={`text-xs mt-1 ${passStrength.score >= 80 ? 'text-green-600' :
                                passStrength.score >= 60 ? 'text-blue-600' :
                                    passStrength.score >= 40 ? 'text-yellow-600' :
                                        'text-red-600'
                                }`}>
                                {passStrength.feedback.map((message, index) => (
                                    <div key={index} className="flex items-start">
                                        <svg
                                            className={`flex-shrink-0 h-4 w-4 mt-0.5 mr-1 ${passStrength.score >= 60 ? 'text-green-500' : 'text-yellow-500'
                                                }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            {passStrength.score >= 60 ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            )}
                                        </svg>
                                        <span>{message}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                }

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={generateNewPassword}
                        className="flex-1 bg-yellow-950 text-white font-semibold px-6 py-3 rounded-lg hover:bg-yellow-900 transition flex items-center justify-center"
                    >
                        {isLoading ? <Loader /> : "Generate Password"}
                    </button>
                    {password && (
                        <button
                            onClick={() => navigator.clipboard.writeText(password)}
                            className="flex-1 bg-gray-100 text-gray-800 font-semibold px-6 py-3 cursor-pointer rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copy
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}