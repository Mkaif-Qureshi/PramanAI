"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RecentChats from '../components/RecentChats';
import Image from 'next/image';
import "./styles.css"

const MainPage = () => {
    const [document, setDocument] = useState(null);
    const [extractedData, setExtractedData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [textInput, setTextInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/api/ocr', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setExtractedData([data.text]);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSearch = () => {
        // Implement search logic here
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleTextExtraction = async () => {
        const response = await fetch('http://localhost:5000/api/ner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: textInput }),
        });
        const data = await response.json();
        if (response.ok) {
            setExtractedData(data.entities);
            handleCloseModal();
        } else {
            console.error(data.error);
        }
    };

    const entityColors = {
        "B-CASE_NUMBER": "#FFDDC1", // Light Orange
        "B-COURT": "#CFE2F3", // Light Blue
        "B-DATE": "#E6E6FA", // Lavender
        "B-GPE": "#C1E1C1", // Light Green
        "B-JUDGE": "#FFB6C1", // Light Pink
        "B-ORG": "#C1C1FF", // Light Purple
        "B-OTHER_PERSON": "#FFD700", // Gold
        "B-PETITIONER": "#FF6347", // Tomato
        "B-PRECEDENT": "#E0FFFF", // Light Cyan
        "B-PROVISION": "#E6B0AA", // Light Coral
        "B-RESPONDENT": "#F5F5DC", // Beige
        "B-STATUTE": "#D3D3D3", // Light Gray
        "B-WITNESS": "#DFFF00", // Lemon
        "I-CASE_NUMBER": "#FFDDC1", // Light Orange
        "I-COURT": "#CFE2F3", // Light Blue
        "I-DATE": "#E6E6FA", // Lavender
        "I-GPE": "#C1E1C1", // Light Green
        "I-JUDGE": "#FFB6C1", // Light Pink
        "I-ORG": "#C1C1FF", // Light Purple
        "I-OTHER_PERSON": "#FFD700", // Gold
        "I-PETITIONER": "#FF6347", // Tomato
        "I-PRECEDENT": "#E0FFFF", // Light Cyan
        "I-PROVISION": "#E6B0AA", // Light Coral
        "I-RESPONDENT": "#F5F5DC", // Beige
        "I-STATUTE": "#D3D3D3", // Light Gray
        "I-WITNESS": "#DFFF00", // Lemon
        "O": "#FFFFFF" // White for non-entities
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

                        {/* Extract from text button */}
                        <button
                            onClick={handleOpenModal}
                            className="relative inline-block text-gray-800 px-4 py-2 border border-black overflow-hidden group bg-white font-semibold transition-all duration-300 hover:bg-black hover:text-white"
                        >
                            <span className="relative z-10">Extract from Text</span>
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

                    {/* Modal for text extraction */}
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                            <div className="bg-white p-6 shadow-md w-full max-w-md">
                                <h2 className="text-lg font-semibold mb-4">Extract Data from Text</h2>
                                <textarea
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    rows="4"
                                    className="border p-2 w-full border-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition-all duration-300"
                                    placeholder="Enter the text here..."
                                />
                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 border border-gray-300  bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleTextExtraction}
                                        className="px-4 py-2 border border-black bg-white text-gray-800 font-semibold hover:bg-black hover:text-white transition-all duration-300"
                                    >
                                        Extract
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white p-4 shadow-md mt-8 border border-gray-300">
                        <h2 className="text-lg font-semibold mb-4">Extracted Data</h2>
                        <hr className="border-gray-300 mb-4" />
                        <div className="relative">
                            {extractedData.map((item, index) => (
                                <span
                                    key={index}
                                    style={{
                                        backgroundColor: entityColors[item.entity] || '#FFFFFF',
                                        color: '#000000',
                                        padding: '2px 4px',
                                        borderRadius: '4px',
                                        marginRight: '4px',
                                        position: 'relative',
                                        cursor: 'default'
                                    }}
                                    className="entity-item"
                                >
                                    {item.word}
                                    <span className="tooltip">
                                        {item.entity.replace('B-', '').replace('I-', '')}
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MainPage;
