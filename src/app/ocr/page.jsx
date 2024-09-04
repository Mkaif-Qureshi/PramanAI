"use client";
import { useState } from "react";
import Image from "next/image";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PulseLoader } from "react-spinners"; // Add react-spinners for cool loading animations

const OcrPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [ocrText, setOcrText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [selectedLang, setSelectedLang] = useState("eng");
    const [isUploading, setIsUploading] = useState(false); // State to manage file upload status

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            setError("Please select a file.");
            return;
        }
        setSelectedFile(file);
        setFileName(file.name);
        setError("");
        setIsUploading(true); // Start upload animation
        setTimeout(() => setIsUploading(false), 1000); // Simulate upload delay
    };

    const handleExtractText = async () => {
        if (!selectedFile) {
            setError("Please select a file.");
            return;
        }
        setIsProcessing(true);
        setError("");

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("lang", selectedLang);

        try {
            const response = await fetch("http://localhost:5000/api/ocr", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setOcrText(data.text);
            } else {
                setError(data.error || "An error occurred.");
            }
        } catch (err) {
            setError("Failed to process the file.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSaveAsText = () => {
        if (!ocrText.trim()) {
            toast.error("No text to save!", { position: "bottom-right" });
            return;
        }

        const blob = new Blob([ocrText], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName.split(".")[0]}_extracted.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Text downloaded successfully!", {
            position: "bottom-right",
        });
    };

    const handleReset = () => {
        if (window.confirm("Do you want to clear the text?")) {
            setOcrText("");
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
                <section className="mb-8">
                    <h1 className="text-xl sm:text-2xl font-bold mb-4">OCR Processing</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <label className="flex items-center border p-2 w-full sm:w-1/6 border-gray-300 cursor-pointer text-center hover:border-black transition-colors duration-300 flex-shrink-0 py-[0.6rem]">
                            <input
                                type="file"
                                accept=".pdf, .jpg, .jpeg, .png"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="flex items-center space-x-2 justify-center">
                                <Image
                                    src="/icons/attach.svg"
                                    alt="Attach File"
                                    width={22}
                                    height={22}
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Attach File
                                </span>
                            </div>
                        </label>

                        {isUploading && (
                            <div className="flex items-center justify-center space-x-2">
                                <PulseLoader color={"#000000"} size={10} />
                                <span className="text-sm font-medium text-gray-700">
                                    Uploading...
                                </span>
                            </div>
                        )}

                        <select
                            value={selectedLang}
                            onChange={handleLangChange}
                            className="border border-gray-300 p-[0.70rem]"
                        >
                            <option value="eng">English</option>
                            <option value="asm">Assamese</option>
                            <option value="ben">Bengali</option>
                            <option value="guj">Gujarati</option>
                            <option value="hin">Hindi</option>
                            <option value="kan">Kannada</option>
                            <option value="mal">Malayalam</option>
                            <option value="mar">Marathi</option>
                            <option value="ori">Oriya (Odia)</option>
                            <option value="pan">Punjabi</option>
                            <option value="san">Sanskrit</option>
                            <option value="sin">Sinhala</option>
                            <option value="tam">Tamil</option>
                            <option value="tel">Telugu</option>
                            <option value="urd">Urdu</option>
                        </select>

                        <button
                            onClick={handleExtractText}
                            className="w-40 bg-black text-white font-semibold py-2 mt-4 transition-all duration-300 hover:bg-gray-700"
                            disabled={isProcessing}
                        >
                            Extract Text
                        </button>

                        {isProcessing && (
                            <div className="flex items-center justify-center space-x-2">
                                <PulseLoader color="#000000" size={10} />
                                <span className="text-sm font-medium text-black">
                                    Processing...
                                </span>
                            </div>
                        )}


                        {error && <div className="text-red-600">{error}</div>}
                    </div>

                    {fileName && (
                        <div className="text-gray-700 my-3">
                            <strong>Selected File:</strong> {fileName}
                        </div>
                    )}

                    <div className="bg-white p-4 shadow-md mt-8 border border-gray-300" id="pdf-content">
                        <h2 className="text-lg font-semibold mb-4">Extracted Text</h2>
                        <hr className="border-gray-300" />
                        <ReactQuill
                            value={ocrText}
                            onChange={setOcrText}
                            className="mt-4"
                            placeholder="Extracted text will appear here..."
                        />

                        {ocrText && (
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

export default OcrPage;
