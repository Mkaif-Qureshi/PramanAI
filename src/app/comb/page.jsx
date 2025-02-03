"use client"
import { useState, useRef, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import { v4 as uuidv4 } from "uuid"

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
    O: "#FFFFFF",
}

const DocumentProcessor = () => {
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState("")
    const [messages, setMessages] = useState([])
    const [inputMessage, setInputMessage] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [extractedData, setExtractedData] = useState([])
    const messagesEndRef = useRef(null)
    const [ocrCompleted, setOcrCompleted] = useState(false)
    const [nerCompleted, setNerCompleted] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [modalContent, setModalContent] = useState({ title: "", content: "" })

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messages])

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]
        if (!selectedFile) {
            toast.error("Please select a file.")
            return
        }
        if (selectedFile.type !== "application/pdf") {
            toast.error("Please upload a PDF file only.")
            return
        }
        setFile(selectedFile)
        setFileName(selectedFile.name)
        toast.success("PDF file uploaded successfully!")
        setMessages((prev) => [
            ...prev,
            {
                type: "system",
                content: `File "${selectedFile.name}" uploaded successfully. You can now select a function to process the document.`,
            },
        ])
    }

    const processDocument = async (func) => {
        if (!file) {
            toast.error("Please upload a PDF file first.")
            return
        }
        if ((func === "OCR" && ocrCompleted) || (func === "NER" && nerCompleted)) {
            toast.info(`${func} has already been completed for this document.`)
            return
        }
        setIsProcessing(true)

        try {
            const formData = new FormData()
            formData.append("file", file)

            let endpoint = ""
            let data = {}
            switch (func) {
                case "OCR":
                    endpoint = "http://localhost:5000/api/ocr"
                    break
                case "NER":
                    endpoint = "http://localhost:5000/api/ner"
                    break
                case "Translate":
                    endpoint = "http://localhost:5000/api/translate"
                    break
                case "Create Document":
                    endpoint = "http://localhost:5000/api/generate-document"
                    // Debugging: Log the current state of messages
                    console.log("Current messages:", messages)

                    const ocrResult = messages.find((m) => m.type === "assistant" && m.content.includes("OCRtext"))
                    const nerResult = messages.find((m) => m.type === "assistant" && m.entities)

                    // Debugging: Log the found results
                    console.log("OCR Result:", ocrResult)
                    console.log("NER Result:", nerResult)

                    if (!ocrResult || !nerResult) {
                        toast.error("Please complete OCR and NER before creating a document.")
                        setIsProcessing(false)
                        return
                    }

                    try {
                        data = {
                            ocr_text: JSON.parse(ocrResult.content).OCRtext,
                            ner_data: nerResult.entities,
                        }
                    } catch (parseError) {
                        console.error("Error parsing OCR result:", parseError)
                        toast.error("Error processing OCR data. Please try OCR again.")
                        setIsProcessing(false)
                        return
                    }
                    break
                default:
                    throw new Error("Invalid function selected")
            }

            let response
            if (func === "Create Document") {
                console.log("Sending data to create document:", data)
                response = await axios.post(endpoint, data)
            } else {
                response = await axios.post(endpoint, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
            }

            if (func === "NER") {
                setNerCompleted(true)
                const entities = response.data.entities || []
                setExtractedData(entities)
                setMessages((prev) => [
                    ...prev,
                    { type: "user", content: `Process ${func} on ${fileName}` },
                    {
                        type: "assistant",
                        content: "NER extraction completed.",
                        entities: entities,
                    },
                ])
            } else if (func === "OCR") {
                setOcrCompleted(true)
                setMessages((prev) => [
                    ...prev,
                    { type: "user", content: `Process ${func} on ${fileName}` },
                    {
                        type: "assistant",
                        content: JSON.stringify(response.data, null, 2),
                    },
                ])
            } else {
                setMessages((prev) => [
                    ...prev,
                    { type: "user", content: `Process ${func} on ${fileName}` },
                    {
                        type: "assistant",
                        content: "Document generated successfully!",
                        documentData: response.data // Store the document data here
                    },
                ]);
            }
        } catch (error) {
            console.error("Error processing document:", error)
            toast.error("Failed to process the document.")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return

        const newMessages = [...messages, { type: "user", content: inputMessage }]
        setMessages(newMessages)
        setInputMessage("")

        try {
            const userId = localStorage.getItem("userId") || uuidv4()
            localStorage.setItem("userId", userId)

            const response = await axios.post("http://localhost:5000/api/chatbot", {
                query: inputMessage,
                user_id: userId,
            })

            setMessages((prev) => [
                ...newMessages,
                {
                    type: "assistant",
                    content: response.data.response,
                    isMarkdown: true,
                },
            ])
        } catch (error) {
            console.error("Error in chat interaction:", error)
            setMessages((prev) => [...newMessages, { type: "assistant", content: "Error processing your query." }])
        }
    }

    const handleShowResults = (type) => {
        if (type === "OCR" && ocrCompleted) {
            const ocrResult = messages.find((m) => m.type === "assistant" && m.content.includes("OCR"))
            setModalContent({ title: "OCR Results", content: ocrResult ? ocrResult.content : "No OCR results found." })
            setShowModal(true)
        } else if (type === "NER" && nerCompleted) {
            setModalContent({
                title: "NER Results",
                content: (
                    <div className="flex flex-wrap gap-2">
                        {extractedData.map((item, index) => (
                            <span
                                key={index}
                                style={{
                                    backgroundColor: entityColors[item.entity] || "#FFFFFF",
                                    color: "#000000",
                                    padding: "2px 4px",
                                    borderRadius: "4px",
                                    marginRight: "4px",
                                    position: "relative",
                                    cursor: "default",
                                }}
                                className="entity-item"
                            >
                                {item.word}
                                <span className="tooltip">{item.entity.replace("B-", "").replace("I-", "")}</span>
                            </span>
                        ))}
                    </div>
                ),
            })
            setShowModal(true)
        }
    }

    const handleNewChat = () => {
        setMessages([])
        setFile(null)
        setFileName("")
        setExtractedData([])
        setOcrCompleted(false)
        setNerCompleted(false)
    }

    const handleDownloadDocument = (documentData) => {
        // Create a JSON blob
        const jsonString = JSON.stringify(documentData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        // Create a temporary link and trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = `legal-document-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleEditDocument = (documentData) => {
        // Implement your edit logic here
        setModalContent({
            title: "Edit Document",
            content: (
                <div className="space-y-4">
                    {Object.entries(documentData).map(([key, value]) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-gray-700">
                                {key.replace(/_/g, ' ').toUpperCase()}
                            </label>
                            {Array.isArray(value) ? (
                                <input
                                    type="text"
                                    defaultValue={value.join(', ')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    onChange={(e) => {
                                        // Handle array input
                                        documentData[key] = e.target.value.split(',').map(s => s.trim());
                                    }}
                                />
                            ) : (
                                <input
                                    type="text"
                                    defaultValue={value}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    onChange={(e) => {
                                        documentData[key] = e.target.value;
                                    }}
                                />
                            )}
                        </div>
                    ))}
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => {
                            // Save the updated document data
                            toast.success("Document updated successfully!");
                            setShowModal(false);
                        }}
                    >
                        Save Changes
                    </button>
                </div>
            )
        });
        setShowModal(true);
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <div className="w-64 bg-gray-100 text-black p-4 pb-0 flex flex-col border-r border-gray-300">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-md font-bold">Document Processor</h1>
                    <button
                        className="bg-blue-500 text-white p-2 rounded-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={handleNewChat}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                <label className="flex items-center justify-center border border-gray-300 p-2 rounded cursor-pointer hover:bg-gray-200 mb-4">
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm font-medium">Upload PDF</span>
                </label>

                {fileName && <p className="text-sm text-gray-600 mb-4 truncate">{fileName}</p>}

                <div className="space-y-2">
                    {[
                        {
                            name: "OCR",
                            icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2",
                        },
                        {
                            name: "NER",
                            icon: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14",
                        },
                        {
                            name: "Translate",
                            icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129",
                        },
                        {
                            name: "Create Document",
                            icon: "M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                        },
                    ].map((func) => {
                        const isCompleted = (func.name === "OCR" && ocrCompleted) || (func.name === "NER" && nerCompleted)
                        return (
                            <button
                                key={func.name}
                                onClick={() => processDocument(func.name)}
                                className={`w-full p-2 rounded ${isProcessing
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : isCompleted
                                        ? "bg-green-200 hover:bg-green-300"
                                        : "bg-white hover:bg-gray-200"
                                    } border border-gray-300 transition-colors duration-200 flex items-center justify-between`}
                                disabled={isProcessing || !file || isCompleted}
                            >
                                <div className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={func.icon} />
                                    </svg>
                                    {func.name}
                                </div>
                                {isCompleted && (
                                    <button onClick={() => handleShowResults(func.name)} className="ml-2 focus:outline-none">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Main chat and output interface */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-3/4 p-3 rounded-lg ${message.type === "user"
                                    ? "bg-blue-500 text-white"
                                    : message.type === "system"
                                        ? "bg-gray-200 text-gray-800"
                                        : "bg-gray-100 text-gray-800 border border-gray-300"
                                    }`}
                            >


                                {message.entities ? (
                                    <div className="flex flex-wrap gap-2">
                                        {message.entities.map((item, entityIndex) => (
                                            <span
                                                key={entityIndex}
                                                style={{
                                                    backgroundColor: entityColors[item.entity] || "#FFFFFF",
                                                    color: "#000000",
                                                    padding: "2px 4px",
                                                    borderRadius: "4px",
                                                    marginRight: "4px",
                                                    position: "relative",
                                                    cursor: "default",
                                                }}
                                                className="entity-item"
                                            >
                                                {item.word}
                                                <span className="tooltip">{item.entity.replace("B-", "").replace("I-", "")}</span>
                                            </span>
                                        ))}
                                    </div>
                                ) : message.documentData ? (
                                    <div>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {Object.entries(message.documentData).map(([key, value]) => (
                                                        <tr key={key}>
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                                                                {key.replace(/_/g, ' ').toUpperCase()}
                                                            </td>
                                                            <td className="px-4 py-2 whitespace-normal text-sm text-gray-500">
                                                                {Array.isArray(value) ? (
                                                                    <ul className="list-disc pl-4">
                                                                        {value.map((item, index) => (
                                                                            <li key={index}>{item}</li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    value
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="flex justify-end space-x-2 mt-2">
                                            <button
                                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                                onClick={() => handleEditDocument(message.documentData)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button
                                                className="text-gray-600 hover:text-blue-600 transition-colors"
                                                onClick={() => handleDownloadDocument(message.documentData)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ) : message.type === "assistant" && message.isMarkdown ? (
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                ) : (
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-gray-300 p-4">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-blue-500 text-white p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <ToastContainer position="bottom-right" />

            {/* Inline CSS for tooltip */}
            <style jsx>{`
        .entity-item {
          position: relative;
          display: inline-block;
        }

        .tooltip {
          visibility: hidden;
          opacity: 0;
          background-color: #333;
          color: #fff;
          text-align: center;
          border-radius: 4px;
          padding: 5px;
          position: absolute;
          z-index: 1;
          bottom: 125%; /* Position above the text */
          left: 50%;
          margin-left: -60px; /* Center the tooltip */
          transition: opacity 0.3s;
          width: 120px;
          white-space: nowrap;
        }

        .tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #333 transparent transparent transparent;
        }

        .entity-item:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{modalContent.title}</h2>
                        <div className="mb-4">
                            {typeof modalContent.content === "string" ? (
                                <pre className="whitespace-pre-wrap">{modalContent.content}</pre>
                            ) : (
                                modalContent.content
                            )}
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DocumentProcessor

