"use client";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PulseLoader } from "react-spinners";

const TranslationPage = () => {
    const [originalText, setOriginalText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [selectedLang, setSelectedLang] = useState("fr"); // Default to French

    const handleTranslate = async () => {
        if (!originalText.trim()) {
            setError("Please enter text to translate.");
            return;
        }
        setIsProcessing(true);
        setError("");

        const formData = new FormData();
        formData.append("text", originalText);
        formData.append("lang", selectedLang);

        try {
            const response = await fetch("http://localhost:5000/api/translate", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setTranslatedText(data.text);
            } else {
                setError(data.error || "An error occurred.");
            }
        } catch (err) {
            setError("Failed to translate text.");
        } finally {
            setIsProcessing(false);
        }
    };


    const handleSaveAsText = () => {
        if (!translatedText.trim()) {
            toast.error("No text to save!", { position: "bottom-right" });
            return;
        }

        const blob = new Blob([translatedText], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "translated_text.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Text downloaded successfully!", {
            position: "bottom-right",
        });
    };

    const handleReset = () => {
        if (window.confirm("Do you want to clear the text?")) {
            setOriginalText("");
            setTranslatedText("");
            toast.info("Text cleared.", {
                position: "bottom-right",
            });
        }
    };

    const handleLangChange = (event) => {
        setSelectedLang(event.target.value);
    };

    return (
        <div className="flex min-h-screen bg-light-gray">
            <main className="flex-grow p-4 sm:p-8">
                <section className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* Input Text Section */}
                    <div className="flex-1 bg-white border border-gray-300 p-4 shadow-md">
                        <h1 className="text-xl font-bold mb-4">Input Text</h1>
                        <textarea
                            value={originalText}
                            onChange={(e) => setOriginalText(e.target.value)}
                            className="w-full h-60 border border-gray-300 p-2"
                            placeholder="Enter text to be translated..."
                        />

                        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
                            <select
                                value={selectedLang}
                                onChange={handleLangChange}
                                className="border border-gray-300 p-[0.70rem]"
                            >
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="es">Spanish</option>
                                <option value="it">Italian</option>
                                <option value="pt">Portuguese</option>
                                <option value="zh">Chinese</option>
                                <option value="ja">Japanese</option>
                                <option value="ko">Korean</option>
                            </select>

                            <button
                                onClick={handleTranslate}
                                className="w-40 bg-black text-white font-semibold py-2 mt-4 transition-all duration-300 hover:bg-gray-700"
                                disabled={isProcessing}
                            >
                                Translate
                            </button>

                            {isProcessing && (
                                <div className="flex items-center justify-center space-x-2">
                                    <PulseLoader color="#000000" size={10} />
                                    <span className="text-sm font-medium text-black">
                                        Processing...
                                    </span>
                                </div>
                            )}
                        </div>

                        {error && <div className="text-red-600 mt-4">{error}</div>}
                    </div>

                    {/* Output Text Section */}
                    <div className="flex-1 bg-white border border-gray-300 p-4 shadow-md">
                        <h1 className="text-xl font-bold mb-4">Translated Text</h1>
                        <textarea
                            value={translatedText}
                            readOnly
                            className="w-full h-60 border border-gray-300 p-2"
                            placeholder="Translated text will appear here..."
                        />

                        {translatedText && (
                            <div className="flex justify-end mt-4 space-x-4">
                                <button
                                    onClick={handleSaveAsText}
                                    className="border-2 border-black hover:bg-blue-500 hover:text-white text-black py-1 px-4"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="border-2 border-black hover:bg-red-500 hover:text-white text-black py-1 px-4"
                                >
                                    Reset
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <ToastContainer />
        </div>
    );
};

export default TranslationPage;
