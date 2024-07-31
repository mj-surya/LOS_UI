import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '../Components/UploadFile.css';

function PDFViewer({ file }) {
    // Use the correct worker URL that matches pdfjs-dist version
    const workerUrl = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

    return (
        <div className="pdf-viewer-container">
            <Worker workerUrl={workerUrl}>
                <Viewer fileUrl={file} />
            </Worker>
        </div>
    );
}

export default PDFViewer;
