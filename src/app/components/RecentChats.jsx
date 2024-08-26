"use client";
import { useState } from 'react';
import Image from 'next/image'; // Import Next.js image component

const RecentChats = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [chats, setChats] = useState([
        "Chat 1",
        "Chat 2",
        "Chat 3",
        "Chat 4",
    ]);

    const toggleSlider = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`h-screen flex ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white shadow-md border-r border-gray-300`}>
            <div className="flex flex-col w-full">
                {/* Toggle Button */}
                <button
                    onClick={toggleSlider}
                    className="p-2 bg-gray-200 hover:bg-gray-300 focus:outline-none transition-colors duration-200"
                >
                    <Image
                        src={isOpen ? "/icons/sidebar-close.svg" : "/icons/sidebar-open.svg"} // Path to your SVGs
                        alt="Toggle Sidebar"
                        width={24}
                        height={24}
                    />
                </button>

                {/* Recent Chats */}
                {isOpen && (
                    <div className="overflow-y-auto flex-grow">
                        <h2 className="text-lg font-semibold p-4 border-b border-gray-300">Recent Chats</h2>
                        <ul className="p-4 space-y-2">
                            {chats.map((chat, index) => (
                                <li
                                    key={index}
                                    className="cursor-pointer p-2 hover:bg-gray-100 transition-colors duration-200"
                                >
                                    {chat}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentChats;
