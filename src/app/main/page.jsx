"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RecentChats from '../components/RecentChats';
import Image from 'next/image';
import "./styles.css";
import axios from 'axios';

const MainPage = () => {
    const [document, setDocument] = useState(null);
    const [extractedData, setExtractedData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [textInput, setTextInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Upload file and process with NER
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setUploadProgress(0);

        try {
            // Send file to server to extract text
            const ocrResponse = await axios.post('http://localhost:5000/api/ocr', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setUploadProgress(progress);
                },
            });

            // Extract text using NER
            const text = ocrResponse.data.text;
            const nerResponse = await fetch('http://localhost:5000/api/ner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            const nerData = await nerResponse.json();
            if (nerResponse.ok) {
                setExtractedData(nerData.entities);  // Assuming API returns NER entities in 'entities' field
            } else {
                console.error(nerData.error);
            }

            setDocument(file);
            setUploadProgress(100);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setUploading(false);
        }
    };


    // Function for NER-based text extraction
    const handleTextExtraction = async () => {
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/ner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: textInput }), // Pass text for NER extraction
            });

            const data = await response.json();
            if (response.ok) {
                setExtractedData(data.entities);  // Assuming API returns NER entities in 'entities' field
                handleCloseModal();
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const entityColors = {
        "B-CASE_NUMBER": "#FFDDC1",
        "B-COURT": "#CFE2F3",
        "B-DATE": "#E6E6FA",
        "B-GPE": "#C1E1C1",
        "B-JUDGE": "#FFB6C1",
        "B-ORG": "#C1C1FF",
        "B-OTHER_PERSON": "#FFD700",
        "B-PETITIONER": "#FF6347",
        "B-PRECEDENT": "#E0FFFF",
        "B-PROVISION": "#E6B0AA",
        "B-RESPONDENT": "#F5F5DC",
        "B-STATUTE": "#D3D3D3",
        "B-WITNESS": "#DFFF00",
        "I-CASE_NUMBER": "#FFDDC1",
        "I-COURT": "#CFE2F3",
        "I-DATE": "#E6E6FA",
        "I-GPE": "#C1E1C1",
        "I-JUDGE": "#FFB6C1",
        "I-ORG": "#C1C1FF",
        "I-OTHER_PERSON": "#FFD700",
        "I-PETITIONER": "#FF6347",
        "I-PRECEDENT": "#E0FFFF",
        "I-PROVISION": "#E6B0AA",
        "I-RESPONDENT": "#F5F5DC",
        "I-STATUTE": "#D3D3D3",
        "I-WITNESS": "#DFFF00",
        "O": "#FFFFFF"
    };

    return (
        <div className="flex min-h-screen bg-light-gray">
            <main className="flex-grow p-4 sm:p-8 overflow-x-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Left Section: Upload and Display */}
                    <section className="w-full sm:w-1/2 p-4 bg-white border-r border-gray-300">
                        <h2 className="text-lg font-bold mb-4">Upload Document</h2>
                        <div className='flex items-center space-x-4'>
                            <label className="flex items-center border p-2 flex-grow border-gray-300 cursor-pointer text-center">
                                <input
                                    type="file"
                                    accept=".pdf, .docx, .txt"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <div className="flex items-center space-x-2">
                                    <Image
                                        src="/icons/attach.svg"
                                        alt="Attach File"
                                        width={22}
                                        height={22}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Attach File</span>
                                </div>
                            </label>

                            <span>-Or-</span>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-block text-gray-700 px-4 py-2 border border-gray-300 bg-white font-semibold"
                            >
                                <span className="relative">Extract from Text</span>
                            </button>
                        </div>

                        {uploading && (
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Uploading: {uploadProgress}%</p>
                                <div className="bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mt-4">
                            {document && (
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-2">File uploaded: {document.name}</p>
                                    <div className="border border-gray-300 overflow-x-auto">
                                        <embed src={URL.createObjectURL(document)} width="100%" height="500px" type="application/pdf" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Right Section: Output and Query */}
                    <section className="w-full sm:w-1/2 p-4 bg-white">
                        <h2 className="text-lg font-bold mb-4">Query and Extracted Data</h2>
                        <div className="bg-white p-4 shadow-md border border-gray-300 overflow-x-auto">
                            <h2 className="text-lg font-semibold mb-4">Extracted Data</h2>
                            <hr className="border-gray-300 mb-4" />
                            <div className="relative flex flex-wrap gap-2">
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

                        <div className="flex space-x-4 my-4">
                            <input
                                type="text"
                                placeholder="Enter your query..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border p-2 flex-grow border-gray-300 focus:ring-1 focus:ring-black"
                            />

                            <button
                                onClick={() => console.log(searchQuery)} // You can update the search functionality
                                className="inline-block text-gray-800 px-4 py-2 border border-gray-300 bg-white font-semibold"
                            >
                                Enter
                            </button>
                        </div>
                    </section>
                </div>

                {/* Modal for text extraction */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                        <div className="relative bg-white p-4 shadow-lg w-full max-w-lg">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                                aria-label="Close"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            <h2 className="text-lg font-bold mb-4">Extract Entities from Text</h2>
                            <textarea
                                className="w-full border border-gray-300 p-2 mb-4"
                                rows="6"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Paste or type text here for extraction..."
                            />

                            <button
                                onClick={handleTextExtraction}
                                disabled={loading}
                                className="inline-block w-full text-gray-800 px-4 py-2 border border-gray-300 bg-white font-semibold"
                            >
                                {loading ? "Extracting..." : "Extract Entities"}
                            </button>
                        </div>
                    </div>
                )}
            </main>


        </div>
    );
};

export default MainPage;
