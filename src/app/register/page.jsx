"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleRegister = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match", {
                position: "bottom-right"
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('User registered successfully!', {
                    position: "bottom-right"
                });
                setTimeout(() => {
                    router.push('/login');
                }, 1500);
            } else {
                toast.error('Registration failed!', {
                    position: "bottom-right"
                });
            }
        } catch (error) {
            console.error('Error during registration:', error);
            toast.error('An error occurred during registration.', {
                position: "bottom-right"
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-light-gray">
            <div className="w-full max-w-md p-8 bg-white shadow-lg border border-gray-300">
                <h2 className="text-2xl font-bold text-left mb-6">Register</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="border w-full p-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border w-full p-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="border w-full p-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition-all duration-300"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white font-semibold py-2 mt-4 transition-all duration-300 hover:bg-gray-700"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="text-black font-semibold hover:underline">
                            login
                        </a>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default RegisterPage;
