"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RecentChats from '../components/RecentChats';
import Image from 'next/image';

const MainPage = () => {
    const [document, setDocument] = useState(null);
    const [extractedData, setExtractedData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        extractData(file).then((data) => setExtractedData(data));
    };

    const handleSearch = () => {
        // Implement search logic here
    };

    return (
        <div className="flex min-h-screen bg-light-gray">
            {/* Recent Chats slider */}
            <RecentChats />

            {/* Main content area */}
            <main className="flex-grow p-4 sm:p-8">
                <section className="mb-8">
                    <h1 className="text-xl sm:text-2xl font-bold mb-4">Legal Data Extraction</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        {/* Attach file box */}
                        <label className="flex items-center border p-2 w-full sm:w-1/6 border-gray-300 cursor-pointer text-center hover:border-black transition-colors duration-300 flex-shrink-0 py-[0.6rem]">
                            <input
                                type="file"
                                accept=".pdf, .docx, .txt"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <div className='flex items-center space-x-2 justify-center'>
                                <Image
                                    src="/icons/attach.svg"
                                    alt="Attach File"
                                    width={22}
                                    height={22}
                                />
                                <span className="text-sm font-medium text-gray-700">Attach File</span>
                            </div>
                        </label>

                        {/* Query input box */}
                        <input
                            type="text"
                            placeholder="Enter your query..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border p-2 flex-grow border-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition-all duration-300"
                        />

                        {/* Search button */}
                        <button
                            onClick={handleSearch}
                            className="relative inline-block text-gray-800 px-4 py-2 border border-black overflow-hidden group bg-white font-semibold transition-all duration-300 hover:bg-black hover:text-white"
                        >
                            <span className="relative z-10">Search</span>
                            {/* Left border */}
                            <span className="absolute inset-0 border-t-2 border-black transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></span>
                            {/* Top border */}
                            <span className="absolute inset-0 border-r-2 border-black transform -translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
                            {/* Right border */}
                            <span className="absolute inset-0 border-b-2 border-black transform translate-x-full transition-transform duration-300 group-hover:-translate-x-0"></span>
                            {/* Bottom border */}
                            <span className="absolute inset-0 border-l-2 border-black transform translate-y-full transition-transform duration-300 group-hover:-translate-y-0"></span>
                        </button>
                    </div>
                    <div className="bg-white p-4 shadow-md mt-8 border border-gray-300">
                        <h2 className="text-lg font-semibold mb-4">Extracted Data</h2>
                        <hr className="border-gray-300" />
                        <ul className="list-disc pl-4 space-y-2">
                            {extractedData.length > 0 ? (
                                extractedData.map((item, index) => (
                                    <li key={index} className="py-2 text-gray-700">
                                        {item}
                                    </li>
                                ))
                            ) : (
                                <li className="py-2 text-gray-500">No data available</li>
                            )}
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MainPage;
