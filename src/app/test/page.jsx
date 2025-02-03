"use client"
import { useState } from "react"
import Image from "next/image"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { PulseLoader } from "react-spinners"
import axios from "axios"

const DocumentProcessor = () => {
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState("")
    const [extractedText, setExtractedText] = useState("")
    const [translatedText, setTranslatedText] = useState("")
    const [entities, setEntities] = useState([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState("")
    const [ocrLang, setOcrLang] = useState("eng")
    const [translateLang, setTranslateLang] = useState("en")
    const [chatHistory, setChatHistory] = useState([])
    const [chatInput, setChatInput] = useState("")

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]
        if (!selectedFile) {
            setError("Please select a file.")
            return
        }
        setFile(selectedFile)
        setFileName(selectedFile.name)
        setError("")
    }

    const processDocument = async () => {
        if (!file) {
            setError("Please select a file.")
            return
        }
        setIsProcessing(true)
        setError("")

        try {
            // Step 1: OCR
            const formData = new FormData()
            formData.append("file", file)
            formData.append("lang", ocrLang)

            const ocrResponse = await axios.post("http://localhost:5000/api/ocr", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            setExtractedText(ocrResponse.data.text)

            // Step 2: Translation (if not English)
            let textToProcess = ocrResponse.data.text
            if (ocrLang !== "eng") {
                const translationFormData = new FormData()
                translationFormData.append("text", textToProcess)
                translationFormData.append("lang", translateLang)

                const translationResponse = await axios.post("http://localhost:5000/api/translate", translationFormData)
                setTranslatedText(translationResponse.data.text)
                textToProcess = translationResponse.data.text
            }

            // Step 3: NER
            const nerResponse = await axios.post("http://localhost:5000/api/ner", { text: textToProcess })
            setEntities(nerResponse.data.entities)
        } catch (err) {
            setError("Failed to process the document.")
            console.error(err)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleSendMessage = async () => {
        if (!chatInput) return

        const newChatHistory = [...chatHistory, { sender: "user", text: chatInput }]
        setChatHistory(newChatHistory)

        try {
            const response = await axios.post("http://localhost:5000/api/chat", {
                query: chatInput,
                documentText: translatedText || extractedText,
            })

            setChatHistory([...newChatHistory, { sender: "bot", text: response.data.answer }])
            setChatInput("")
        } catch (error) {
            console.error("Error in chat interaction:", error)
            setChatHistory([...newChatHistory, { sender: "bot", text: "Error processing your query." }])
        }
    }

    const entityColors = {
        PERSON: "#FFB6C1",
        ORG: "#C1C1FF",
        GPE: "#C1E1C1",
        DATE: "#E6E6FA",
        NORP: "#FFDDC1",
        CARDINAL: "#E0FFFF",
        ORDINAL: "#D3D3D3",
        LOC: "#FFD700",
        PRODUCT: "#E6B0AA",
        EVENT: "#F5F5DC",
        WORK_OF_ART: "#DFFF00",
        LAW: "#CFE2F3",
        LANGUAGE: "#FFDAB9",
        TIME: "#98FB98",
        PERCENT: "#DDA0DD",
        MONEY: "#F0E68C",
        QUANTITY: "#B0E0E6",
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <main className="flex-grow p-4 sm:p-8">
                <h1 className="text-2xl font-bold mb-6">Document Processor</h1>

                <section className="bg-white border border-gray-300 p-4 shadow-md mb-6">
                    <h2 className="text-xl font-bold mb-4">Upload Document</h2>
                    <div className="flex items-center space-x-4 mb-4">
                        <label className="flex items-center border p-2 cursor-pointer hover:bg-gray-100">
                            <input type="file" accept=".pdf, .jpg, .jpeg, .png" onChange={handleFileChange} className="hidden" />
                            <Image src="/icons/attach.svg" alt="Attach File" width={22} height={22} />
                            <span className="ml-2 text-sm font-medium text-gray-700">Attach File</span>
                        </label>
                        {fileName && <span className="text-sm text-gray-600">{fileName}</span>}
                    </div>

                    <div className="flex space-x-4 mb-4">
                        <select
                            value={ocrLang}
                            onChange={(e) => setOcrLang(e.target.value)}
                            className="border border-gray-300 p-2 rounded"
                        >
                            <option value="eng">English</option>
                            <option value="fra">French</option>
                            <option value="deu">German</option>
                            <option value="spa">Spanish</option>
                            {/* Add more language options as needed */}
                        </select>

                        {ocrLang !== "eng" && (
                            <select
                                value={translateLang}
                                onChange={(e) => setTranslateLang(e.target.value)}
                                className="border border-gray-300 p-2 rounded"
                            >
                                <option value="en">English</option>
                                {/* Add more target language options as needed */}
                            </select>
                        )}

                        <button
                            onClick={processDocument}
                            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
                            disabled={isProcessing}
                        >
                            Process Document
                        </button>
                    </div>

                    {isProcessing && (
                        <div className="flex items-center space-x-2">
                            <PulseLoader color="#4B5563" size={10} />
                            <span className="text-sm font-medium text-gray-600">Processing...</span>
                        </div>
                    )}

                    {error && <div className="text-red-600 mt-2">{error}</div>}
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-300 p-4 shadow-md">
                        <h2 className="text-xl font-bold mb-4">Extracted Text</h2>
                        <ReactQuill value={extractedText} readOnly={true} theme="bubble" />
                    </div>

                    {ocrLang !== "eng" && (
                        <div className="bg-white border border-gray-300 p-4 shadow-md">
                            <h2 className="text-xl font-bold mb-4">Translated Text</h2>
                            <ReactQuill value={translatedText} readOnly={true} theme="bubble" />
                        </div>
                    )}

                    <div className="bg-white border border-gray-300 p-4 shadow-md">
                        <h2 className="text-xl font-bold mb-4">Named Entities</h2>
                        <div className="flex flex-wrap gap-2">
                            {entities.map((item, index) => (
                                <span
                                    key={index}
                                    style={{
                                        backgroundColor: entityColors[item.entity] || "#FFFFFF",
                                        color: "#000000",
                                        padding: "2px 4px",
                                        borderRadius: "4px",
                                    }}
                                    className="text-sm"
                                >
                                    {item.word} ({item.entity})
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 p-4 shadow-md">
                        <h2 className="text-xl font-bold mb-4">Chat with Document</h2>
                        <div className="h-60 overflow-y-auto mb-4 p-2 border border-gray-200 rounded">
                            {chatHistory.map((message, index) => (
                                <div key={index} className={`mb-2 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                                    <span
                                        className={`inline-block p-2 rounded-lg ${message.sender === "user" ? "bg-blue-100" : "bg-gray-200"}`}
                                    >
                                        {message.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex">
                            <input
                                type="text"
                                className="flex-grow border border-gray-300 p-2 rounded-l"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Ask a question..."
                            />
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-r" onClick={handleSendMessage}>
                                Send
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <ToastContainer />
        </div>
    )
}

export default DocumentProcessor

