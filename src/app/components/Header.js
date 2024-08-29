"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import './Header.css';

export default function Header() {
    const [scrollDirection, setScrollDirection] = useState('scrolled-up');
    const [lastScrollY, setLastScrollY] = useState(0);
    const [scrollTimeout, setScrollTimeout] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            const currentScrollY = window.scrollY;
            const scrollDirection = currentScrollY > lastScrollY ? 'scrolled-down' : 'scrolled-up';
            setScrollDirection(scrollDirection);

            setLastScrollY(currentScrollY);

            // Set a timeout to add a slight delay before changing state
            const timeout = setTimeout(() => {
                setScrollDirection(currentScrollY > lastScrollY ? 'scrolled-down' : 'scrolled-up');
            }, 100); // Adjust this value for the delay you prefer

            setScrollTimeout(timeout);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, scrollTimeout]);

    return (
        <header className={`bg-white flex flex-wrap md:flex-nowrap justify-between items-center py-2 px-4 shadow-sm border-b ${scrollDirection}`}>
            <div className="logo font-bold text-xl md:text-2xl mb-2 md:mb-0">
                <Link href="/">PramanAI</Link>
            </div>
            <nav className="flex flex-wrap gap-4 md:gap-6 mb-2 md:mb-0 text-md">
                <Link href="/" className="nav-item">
                    Home
                </Link>
                <Link href="/ocr" className="nav-item">
                    OCR
                </Link>
                <Link href="/services" className="nav-item">
                    Services
                </Link>
                <Link href="/about" className="nav-item">
                    About
                </Link>
            </nav>

            <div className="user-account">
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
            </div>
        </header>
    );
}
