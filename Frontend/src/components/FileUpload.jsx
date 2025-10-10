import React, { useState } from "react";
import { uploadFile } from "../services/api";

const FileUpload = ({ onFileUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setUploading(true);
      try {
        const result = await uploadFile(file);
        // Pass both content and file name to the parent component
        onFileUpload(result.content, result.fileName || file.name);
      } catch (err) {
        console.error("File upload error:", err);
        alert("Failed to upload file. Please try again.");
      } finally {
        setUploading(false);
        setFileName("");
      }
    }
  };

  return (
    <div className="file-upload-container">
      <label htmlFor="file-upload" className="file-upload-label">
        {uploading ? `Uploading ${fileName}...` : "Upload PDF or Text File"}
      </label>
      <input 
        id="file-upload"
        type="file" 
        onChange={handleChange} 
        accept=".pdf,.txt"
        disabled={uploading}
        style={{ display: "none" }}
      />
      <button 
        className="file-upload-button"
        onClick={() => document.getElementById('file-upload').click()}
        disabled={uploading}
      >
        📁 Choose File
      </button>
      {fileName && !uploading && (
        <div className="file-name-display">
          Selected: {fileName}
        </div>
      )}
    </div>
  );
};

export default FileUpload;