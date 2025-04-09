import React, { useContext } from 'react';
import { AuthContext } from '../contextAPI/usercontext';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
const LoginPage = () => {
  const { loginError, handleLogin, email, setEmail } = useContext(AuthContext);

  return (
    <div className="login-page flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-200 to-gray-500 relative overflow-hidden custom-scrollbar" >
      {/* {/* Bubble Background */}
      <div className="bubble-bg bubble-1"></div>
      <div className="bubble-bg bubble-2"></div>
      <div className="bubble-bg bubble-3"></div>
      <div className="bubble-bg bubble-down-1"></div>
      <div className="bubble-bg bubble-down-2"></div>
      <div className="bubble-bg bubble-down-3"></div> 

      {/* Main Content */}
      <div className="text-center relative z-10">
        <Helmet>
          <title>Login | KudosSpot</title>
        </Helmet>
        <h1 className="text-4xl font-bold text-gray-800 mb-6">WELCOME TO KUDOSPOT</h1>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            className={`w-full px-4 py-3 text-lg italic font-semibold border rounded-lg shadow focus:outline-none focus:ring text-center ${
              loginError ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-300'
            }`}
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {loginError && <p className="text-red-500 mt-2">{loginError}</p>}
        </div>
        <button
          onClick={handleLogin}
          className="mt-6 px-24 py-3 text-lg text-white bg-black rounded-lg shadow hover:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Login
        </button>
        <Link>
        <p className="mt-4 text-gray-600">Sign up for new account</p>

        </Link>
      </div>
    </div>
  );
};

export default LoginPage;

