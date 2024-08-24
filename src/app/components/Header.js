import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-white text-gray-800 flex flex-wrap md:flex-nowrap justify-between items-center p-4 shadow-sm border-b">
            <div className="logo font-bold text-2xl mb-4 md:mb-0">
                <Link href="/">PramanAI</Link>
            </div>
            <nav className="flex flex-wrap gap-4 md:gap-6 mb-4 md:mb-0">
                <Link href="/" className="text-gray-800 hover:underline hover:decoration-2 transition-all duration-300">
                    Home
                </Link>
                <Link href="/about" className="text-gray-800 hover:underline hover:decoration-2 transition-all duration-300">
                    About
                </Link>
                <Link href="/services" className="text-gray-800 hover:underline hover:decoration-2 transition-all duration-300">
                    Services
                </Link>
                <Link href="/contact" className="text-gray-800 hover:underline hover:decoration-2 transition-all duration-300">
                    Contact
                </Link>
            </nav>

            <div className="search-bar md:mb-0">
                <input
                    type="text"
                    placeholder="Search..."
                    className="p-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition-all duration-300"
                />
            </div>




            <div className="user-account">
                <Link
                    href="/login"
                    className="mt-1 relative inline-block text-gray-800 px-4 py-2 border border-black overflow-hidden group"
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
