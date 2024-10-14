import React, { useState } from 'react';

const Timestamp = () => {
    const [fileStatus, setFileStatus] = useState("");
    const [fileName, setFileName] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setFileStatus("Uploading...");

            // Create a new FormData object
            const formData = new FormData();
            formData.append("file", file);

            // Set up XMLHttpRequest to track upload progress
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "your_upload_url_here", true);

            // Track progress
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setProgress(percentComplete);
                }
            };

            // On successful upload
            xhr.onload = () => {
                if (xhr.status === 200) {
                    setFileStatus("Uploaded successfully!");
                } else {
                    setFileStatus("Upload failed. Please try again.");
                }
            };

            // Handle upload error
            xhr.onerror = () => {
                setFileStatus("Error uploading file. Please check your connection.");
            };

            // Send the form data
            xhr.send(formData);
        }
    };

    const handleGenerateResponse = () => {
        // Logic for generating the response after the file is uploaded
        alert("Response generated for the uploaded file.");
    };

    return (
        <>
            <h2 className="text-2xl font-bold mt-8 text-gray-800 dark:text-gray-100">
                Upload Your File Here For Timestamp
            </h2>
            <div className="content-area mt-6">
                <div className="flex items-center justify-center w-full">
                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                MP4 (MAX. 1GB)
                            </p>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                    </label>
                </div>

                {/* Status message */}
                <div className="mt-4 text-center">
                    {fileStatus && (
                        <div
                            className={`text-sm font-medium p-2 rounded-md ${
                                fileStatus === "Uploaded successfully!"
                                    ? "text-green-700 bg-green-100"
                                    : "text-yellow-700 bg-yellow-100"
                            }`}
                        >
                            {fileStatus}
                        </div>
                    )}

                    {/* Progress Bar */}
                    {progress > 0 && fileStatus === "Uploading..." && (
                        <div className="w-full bg-gray-200 rounded-full mt-2">
                            <div
                                className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                                style={{ width: `${progress}%` }}
                            >
                                {progress}%
                            </div>
                        </div>
                    )}

                    {/* Display file name if uploaded */}
                    {fileName && fileStatus === "Uploaded successfully!" && (
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            File uploaded: <span className="font-semibold">{fileName}</span>
                        </p>
                    )}
                </div>

                {/* Generate Response Button */}
                <div className="flex mt-6">
                    <button
                        onClick={handleGenerateResponse}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Generate Response
                    </button>
                </div>
            </div>
        </>
    );
}

export default Timestamp