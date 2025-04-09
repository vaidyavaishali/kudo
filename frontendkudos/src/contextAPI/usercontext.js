import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const AuthContext = createContext();

export const UserContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loginError, setloginError] = useState(false);
    const [kudos, setKudos] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const handleLogin = async () => {
        console.log(email)
        if (email.trim() === '') {
            setloginError('Email cannot be empty.');
            return;
        }
        try {
            setloginError(false);
            const response = await axios.post('https://kudo-api-nine.vercel.app/api/users/login', { email });
            if (response.status === 200) {
                const user = response.data?.user;
                if (user) {
                    // Store user data in localStorage
                    localStorage.setItem('user', JSON.stringify(user));
                    // console.log(user, "Login successful");
                    // console.log(localStorage.getItem('user'), "user in localstorage");
                    navigate('/landing-page');
                    Swal.fire({
                        title: 'Login Successful',
                        text: 'You have been logged in successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                } else {
                    Swal.fire({
                        title: 'Login Failed',
                        text: 'Invalid Email',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });                }
            } else {
                setloginError('Invalid username or password.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setloginError(error.response.data.message);
            } else {
                Swal.fire({
                    title: 'Login Failed',
                    text: 'Invalid Email',
                    icon: 'error',
                    confirmButtonText: 'OK',
                }); 
            }
            Swal.fire({
                title: 'Login Failed',
                text: 'An error occurred while logging in. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };


    useEffect(() => {
        fetchAllKudos();
    }, [])
    const fetchAllKudos = async () => {
        try {
            const response = await axios.get("https://kudo-api-nine.vercel.app/api/kudos/get");
            setKudos(response.data.data);
        } catch (error) {
            console.error("Error fetching kudos:", error);
        }
    };

    useEffect(() => {
        fetchAllUser();
    }, [])
    const fetchAllUser = async () => {
        try {
            const response = await axios.get("https://kudospot.vercel.app/api/users/get");
            setAllUsers(response.data);
        } catch (error) {
            console.error("Error fetching kudos:", error);
        }
    }
    return (
        <AuthContext.Provider value={{ name, setName, loginError, setloginError, handleLogin, kudos, allUsers, email, setEmail, fetchAllKudos, setKudos }}>
            {children}
        </AuthContext.Provider>
    );
};
