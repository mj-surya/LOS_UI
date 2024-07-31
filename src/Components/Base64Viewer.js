import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import '../Components/UploadFile.css';

function Base64Viewer({ file }) {
    // Use the correct worker URL that matches pdfjs-dist version
    const workerUrl = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
    
    // Convert the base64 string to a data URL
    const base64DataUrl = `data:application/pdf;base64,${file}`;

    // Create a zoom plugin instance
    const zoomPluginInstance = zoomPlugin();
    const { Zoom } = zoomPluginInstance;

    return (
        <div className="pdf-viewer-container">
            <Worker workerUrl={workerUrl}>
                <Viewer
                    fileUrl={base64DataUrl}
                    plugins={[zoomPluginInstance]}
                />
            </Worker>
            <div className="zoom-controls">
                <Zoom />
            </div>
        </div>
    );
}

export default Base64Viewer;