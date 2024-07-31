import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import '../Components/UploadFile.css';
import PDFViewer from './PDFViewer';

function UploadFile() {
    const fileInputRef = useRef(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [applicationID, setApplicationID] = useState("");
    const [email, setEmail] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
        if (files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleRemoveFile = (fileName) => {
        setUploadedFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName));
        if (selectedFile && selectedFile.name === fileName) {
            setSelectedFile(null);
        }
    };

    const handleSelectFile = (file) => {
        setSelectedFile(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
    
        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailPattern.test(email);
    
        // if (!isValidEmail) {
        //     toast.error("Invalid email address");
        //     return;
        // }
    
        // Create FormData object
        const formData = new FormData();
    
        uploadedFiles.forEach(file => {
            formData.append('files', file);
        });
    
        formData.append('applicationNumber', applicationID);
    
        try {
            const response = await fetch('http://localhost:4400/upload/loan', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                toast.error("Failed to upload files");
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
    
            const result = await response.text();
            console.log('Upload result:', result);
    
            toast.success("Files uploaded successfully");
            setUploadedFiles([]);
            setApplicationID("");
            setEmail("");
    
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
    
            setSelectedFile([]); // Make sure this matches your state variable
    
        } catch (error) {
            console.error('Error uploading files:', error);
            toast.error(`Error uploading files: ${error.message}`);
        }
    };
    
    

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex uploadForm mx-12 p-12 w-full h-full">
                <div className={`flex flex-col ${uploadedFiles.length > 0 ?"w-2/5 pt-2":"w-full pt-10"} items-center`}>
                    <div className={`flex flex-col items-center p-2 mt-8 ${uploadedFiles.length > 0 ?"w-full":"w-1/2"} min-h-48 rounded-lg mb-4 border-4 border-dashed border-gray-300`}>
                        <div className='upload-box rounded-lg w-full p-4 min-h-48 flex flex-col justify-center items-center'>
                            {uploadedFiles.length > 0 ? (
                                <div className='w-full'>
                                    <p className="font-bold text-md">Submit PDFs</p>
                                    <div className="flex items-center mt-6">
                                        <div className='flex w-3/5 justify-center'>
                                            <label htmlFor="inp" className="inp border-2 bg-white border-gray-400">
                                                <input type="email" id="inp" placeholder="&nbsp;" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                                <span className="label">Email</span>
                                                <span className="focus-bg"></span>
                                            </label>
                                        </div>
                                        <div className='flex w-2/5 justify-center'>
                                            <button
                                                type="submit"
                                                className="flex items-center justify-center bg-blue-700 p-2 h-10 w-30 rounded-lg text-white font-bold cursor-pointer"
                                                onClick={handleSubmit}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className='w-full'>
                                    <p className="font-bold text-lg">Upload Loan Documents</p>
                                    <div className="flex items-center mt-4">
                                        <div className='flex w-1/2 justify-center'>
                                            <label htmlFor="applicationID" className="inp border-2 bg-white border-gray-400">
                                                <input type="number" id="applicationID" placeholder="&nbsp;" value={applicationID} onChange={(e) => setApplicationID(e.target.value)} required />
                                                <span className="label">Application Number</span>
                                                <span className="focus-bg"></span>
                                            </label>
                                        </div>
                                        <div className='flex w-1/2 justify-center'>
                                            <label
                                                htmlFor="fileInput"
                                                className={`flex items-center ml-4 justify-center bg-blue-700 p-2 h-10 w-30 rounded-lg text-white font-bold cursor-pointer ${applicationID ? '' : 'opacity-50 pointer-events-none'}`}
                                                onClick={()=>handleUploadClick}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 mr-1"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 2a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H3a1 1 0 1 1 0-2h6V3a1 1 0 0 1 1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>Upload</span>
                                            </label>
                                            <input
                                                type="file"
                                                id="fileInput"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept=".pdf"
                                                ref={fileInputRef}
                                                multiple
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {uploadedFiles.length > 0 && (
                                <div className="w-full mt-4">
                                    <p className="font-bold text-lg mb-2">Uploaded Files</p>
                                    <div className="flex">
                                        <ul className="w-full">
                                            {uploadedFiles.map((file) => (
                                                <li key={file.name} className="flex border-b border-gray-400 py-2 w-full">
                                                    <p className="mr-2">{file.name}</p>
                                                    <button
                                                        className="text-red-500 font-bold"
                                                        onClick={() => handleRemoveFile(file.name)}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {uploadedFiles.length > 0 && (
                    <div className="flex-col w-3/5 p-4 pt-0 pb-10 pl-24">
                        <div className="flex mb-4 justify-center">
                            <label htmlFor="fileSelect" className="flex flex-col block mb-2 font-bold">Select File to Preview:</label>
                            <select
                                id="fileSelect"
                                className="flex flex-col ml-4 border-2 border-gray-400 rounded p-2"
                                onChange={(e) => handleSelectFile(uploadedFiles.find(file => file.name === e.target.value))}
                                value={selectedFile ? selectedFile.name : ''}
                            >
                                <option value="">Select a file</option>
                                {uploadedFiles.map((file) => (
                                    <option key={file.name} value={file.name}>{file.name}</option>
                                ))}
                            </select>
                        </div>
                        {selectedFile && (
                            <div className="mb-2 pb-8">
                                <PDFViewer file={URL.createObjectURL(selectedFile)} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UploadFile;
