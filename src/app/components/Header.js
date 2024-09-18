"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import "./Header.css";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useRouter } from 'next/navigation';

export default function Header() {  
    const [scrollDirection, setScrollDirection] = useState("scrolled-up");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [scrollTimeout, setScrollTimeout] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if user is logged in
    const router = useRouter();

    useEffect(() => {
        // Check if the user is logged in by looking for a token or user data in localStorage
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }

        const handleScroll = () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            const currentScrollY = window.scrollY;
            const scrollDirection =
                currentScrollY > lastScrollY ? "scrolled-down" : "scrolled-up";
            setScrollDirection(scrollDirection);

            setLastScrollY(currentScrollY);

            const timeout = setTimeout(() => {
                setScrollDirection(
                    currentScrollY > lastScrollY ? "scrolled-down" : "scrolled-up"
                );
            }, 100); // Adjust this value for the delay you prefer

            setScrollTimeout(timeout);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY, scrollTimeout]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.info('Logged out successfully', {
            position: "bottom-right"
        });
        router.push('/login');  // Redirect to login page after logout
    };

    return (
        <header
            className={`bg-white flex flex-wrap md:flex-nowrap justify-between items-center py-2 px-4 shadow-sm border-b ${scrollDirection}`}
        >
            <div className="logo font-bold text-xl md:text-2xl mb-2 md:mb-0 flex items-center">
                <Image
                    src="/images/pramanai_logo.svg" // Replace with the actual path to your logo image
                    alt="PramanAI Logo"
                    width={45}
                    height={45}
                    className="rounded-full object-fit mr-2 rotate-animation" // Add the rotate-animation class
                />
                <Link href="/">PramanAI</Link>
            </div>

            <nav className="flex flex-wrap gap-4 md:gap-6 mb-2 md:mb-0 text-md">
                <Link href="/" className="nav-item">
                    HOME
                </Link>
                <Link href="/ocr" className="nav-item">
                    OCR
                </Link>
                <Link href="/translation" className="nav-item">
                    TRANSLATION
                </Link>
                <Link href="/main" className="nav-item">
                    NER
                </Link>
                <Link href="/about" className="nav-item">
                    ABOUT
                </Link>
            </nav>

            <div className="user-account">
                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="relative inline-block text-gray-800 px-4 py-1.5 border border-black overflow-hidden group"
                    >
                        <span className="relative z-10">Logout</span>
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="relative inline-block text-gray-800 px-4 py-1.5 border border-black overflow-hidden group"
                    >
                        <span className="relative z-10">Login</span>
                        {/* Left border */}
                        <span className="absolute inset-0 border-t-2 border-black transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></span>
                        {/* Top border */}
                        <span className="absolute inset-0 border-r-2 border-black transform -translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
                        {/* Right border */}
                        <span className="absolute inset-0 border-b-2 border-black transform translate-x-full transition-transform duration-300 group-hover:-translate-x-0"></span>
                        {/* Bottom border */}
                        <span className="absolute inset-0 border-l-2 border-black transform translate-y-full transition-transform duration-300 group-hover:-translate-y-0"></span>
                    </Link>
                )}
            </div>
        </header>
    );
}
