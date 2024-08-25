import Link from 'next/link';
import './Header.css'; // Ensure your CSS file is imported here

export default function Header() {
    return (
        <header className="bg-white text-gray-800 flex flex-wrap md:flex-nowrap justify-between items-center py-2 px-4 shadow-sm border-b">
            <div className="logo font-bold text-xl md:text-2xl mb-2 md:mb-0">
                <Link href="/">PramanAI</Link>
            </div>
            <nav className="flex flex-wrap gap-4 md:gap-6 mb-2 md:mb-0 text-md">
                <Link href="/" className="nav-item ">
                    Home
                </Link>
                <Link href="/about" className="nav-item ">
                    About
                </Link>
                <Link href="/services" className="nav-item ">
                    Services
                </Link>
                <Link href="/contact" className="nav-item ">
                    Contact
                </Link>
            </nav>

            <div className="search-bar md:mb-0">
                <input
                    type="text"
                    placeholder="Search..."
                    className="p-1.5 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition-all duration-300"
                />
            </div>

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
