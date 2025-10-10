# File Upload Feature Implementation

## Overview
The file upload feature has been successfully integrated into the SigmaGPT Chat application. This allows users to upload PDF or text files and have their content analyzed by the chatbot.

## File Structure
```
Backend/
├── controllers/
│   └── fileController.js     # Handles file upload logic
├── routes/
│   └── fileRoutes.js         # File upload routes
├── utils/
│   └── extractText.js        # Text extraction utility
├── server.js                 # Updated to include file routes
Frontend/
├── src/
│   ├── components/
│   │   └── FileUpload.jsx    # File upload component
│   ├── services/
│   │   └── api.js            # API service for file upload
│   └── ChatWindow.jsx        # Modified to include file upload
└── package.json              # Updated with axios dependency
```

## Implementation Details

### Backend Implementation
1. **File Upload Route**: `/api/files/upload` - Handles multipart form data
2. **Text Extraction**: Currently supports .txt files with placeholder for PDF functionality
3. **Temporary Storage**: Files are stored temporarily during processing and cleaned up afterward

### Frontend Implementation
1. **FileUpload Component**: Provides a user-friendly interface for file selection
2. **API Service**: Handles communication with the backend file upload endpoint
3. **Integration**: Added to the user dropdown menu in the chat interface

## How to Use the File Upload Feature

1. Click on your user profile icon in the top right corner
2. Select "Upload File" from the dropdown menu
3. Choose a .pdf or .txt file from your device
4. The file content will be automatically sent to the chatbot for analysis

## Current Limitations

1. **PDF Parsing**: The PDF parsing functionality is currently a placeholder due to library compatibility issues
2. **File Size**: Large files may take longer to process
3. **Browser Support**: File upload is supported by all modern browsers

## Future Enhancements

1. **Full PDF Support**: Implement complete PDF text extraction
2. **File Type Validation**: Add more robust file type checking
3. **Progress Indicator**: Show upload progress for large files
4. **File Preview**: Display a preview of the uploaded file

## Technical Notes

- Uses multer for handling multipart form data
- Implements proper file cleanup after processing
- Provides error handling for failed uploads
- Supports both PDF and text file formats

## Troubleshooting

1. **Upload fails**:
   - Check file size limits
   - Verify file format is supported
   - Ensure backend server is running

2. **PDF files not parsing**:
   - This is a known limitation in the current implementation
   - Text files work properly

3. **File not appearing in chat**:
   - Check browser console for errors
   - Verify the file was successfully uploaded