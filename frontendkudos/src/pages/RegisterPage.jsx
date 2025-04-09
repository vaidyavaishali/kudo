import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contextAPI/usercontext';
import { Helmet } from 'react-helmet';

function RegisterPage() {
    const { email, setEmail, name, setName } = useContext(AuthContext)
    const [errors, setErrors] = useState({ name: false, email: false });
    const navigate = useNavigate()
    const handleRegister = async () => {
        let hasError = false;
        const newErrors = { name: false, email: false };
        if (name.trim() === '') {
            newErrors.name = true;
            hasError = true;
        }

        if (email.trim() === '' || !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = true;
            hasError = true;
        }

        setErrors(newErrors);

        if (!hasError) {
            try {
                const response = await fetch('https://kudo-api-nine.vercel.app/api/users/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email }),
                });

                if (response.ok) {
                    navigate('/')
                    setName('');
                    setEmail('');
                } else {
                    const errorData = await response.json();
                    alert(`Registration failed: ${errorData.error}`);
                }
            } catch (error) {
                console.error('Error registering user:', error);
                alert('An error occurred during registration. Please try again.');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-200 to-gray-500 relative ">
            <Helmet>
                <title>Register | KudosSpot</title>
            </Helmet>
            {/* {/* Bubble Background */}
            <div className="bubble-bg bubble-1"></div>
            <div className="bubble-bg bubble-2"></div>
            <div className="bubble-bg bubble-3"></div>
            <div className="bubble-bg bubble-down-1"></div>
            <div className="bubble-bg bubble-down-2"></div>
            <div className="bubble-bg bubble-down-3"></div>
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">REGISTER TO KUDOSPOT</h1>
                <div className="relative w-full max-w-md mb-4">
                    <input
                        type="text"
                        className={`w-full px-4 py-3 text-lg italic font-semibold border rounded-lg shadow focus:outline-none focus:ring text-center ${errors.name ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-300'
                            }`}
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setErrors((prev) => ({ ...prev, name: false }));
                        }}

                    />
                    {errors.name && <p className="text-red-500 mt-2">Please enter your name</p>}
                </div>
                <div className="relative w-full max-w-md mb-4">
                    <input
                        type="email"
                        className={`w-full px-4 py-3 text-lg italic font-semibold border rounded-lg shadow focus:outline-none focus:ring text-center ${errors.email ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-300'
                            }`}
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors((prev) => ({ ...prev, email: false }));
                        }}
                    />
                    {errors.email && <p className="text-red-500 mt-2">Please enter a valid email</p>}
                </div>
                <button
                    onClick={handleRegister}
                    className="mt-6 px-24 py-3 text-lg text-white bg-black rounded-lg shadow hover:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Register
                </button>
            </div>
        </div>
    );
}

export default RegisterPage;
