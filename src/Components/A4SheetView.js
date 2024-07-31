import React, { useState, useEffect, useRef } from 'react';
import './UploadFile.css'; // Import your custom CSS file
import * as XLSX from 'xlsx'; // Import the xlsx library
import { jsPDF } from 'jspdf'; // Import jsPDF
import 'jspdf-autotable';

const A4SheetView = ({ datas }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // Reference for the dropdown menu

    useEffect(() => {
        // Function to handle clicks outside of the dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        // Add event listener for clicks outside
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!datas || !datas.data) {
        return <div className="p-4 text-red-500">No data available.</div>;
    }

    const keys = datas.data;

    const getBorderColor = (confidence) => {
        if (confidence > 0.75) return 'border-green-400';
        if (confidence >= 0.5) return 'border-yellow-400';
        return 'border-red-400';
    };

    const getLabelColor = (confidence) => {
        if (confidence > 0.75) return 'bg-green-400';
        if (confidence >= 0.5) return 'bg-yellow-400';
        return 'bg-red-400';
    };

    const exportToExcel = () => {
        if (!datas || !datas.data) return;

        // Create a new workbook and a worksheet
        const workbook = XLSX.utils.book_new();

        // Prepare data for the main sheet
        const keys = datas.data;
        const tableData = [['Key', 'Value','Confidence']]; // Header row

        keys.forEach(key => {
            tableData.push([key.key, key.value,`${(key.confidence * 100).toFixed(2)}%` || 'N/A']);
        });

        // Create a worksheet from the table data
        const tableSheet = XLSX.utils.aoa_to_sheet(tableData);
        XLSX.utils.book_append_sheet(workbook, tableSheet, 'Data');

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, `${datas.Title}.xlsx`);
    };

    const exportToPDF = () => {
        if (!datas || !datas.data) return;

        // Create a new PDF document with A4 page size
        const doc = new jsPDF({
            orientation: 'portrait', // or 'landscape'
            unit: 'mm',
            format: 'a4',
        });

        // Add title
        doc.setFontSize(18);
        doc.text(datas.Title, 14, 22); // Title at position (14, 22) mm

        // Prepare data for the table with confidence column
        const keys = datas.data;
        const tableData = keys.map(key => [
            key.key,
            key.value || 'N/A',
            key.confidence !== undefined ? `${(key.confidence * 100).toFixed(2)}%` : 'N/A'
        ]);

        // Add table to the PDF
        doc.autoTable({
            startY: 30, // Start position for the table, 30 mm from top
            head: [['Key', 'Value', 'Confidence']],
            body: tableData,
            margin: { left: 14, right: 14 }, // Margins for the table
            styles: { cellPadding: 3 }, // Padding inside table cells
        });

        // Sanitize the title to create a valid filename
        const formatFilename = (title) => {
            return title
                .replace(/[\/\\?%*:|"<>]/g, '-') // Replace invalid characters
                .trim(); // Remove any trailing whitespace
        };

        const docName = formatFilename(datas.Title || 'Untitled Document');

        // Save the PDF
        doc.save(`${docName}.pdf`);
    };

    const handlePrintOption = (option) => {
        if (option === 'excel') exportToExcel();
        else if (option === 'pdf') exportToPDF();
        setDropdownOpen(false); // Close the dropdown after selection
    };



    return (
        <div className="mt-4 mb-8 p-8 border border-gray-200 bg-white w-full rounded-lg shadow-lg overflow-auto">
            <div className="relative mb-4" ref={dropdownRef}>
                <h3 className='font-bold text-lg pb-4'>{datas.Title}</h3>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="absolute right-0 top-0 p-2 border border-gray-300 rounded-md bg-blue-600 text-white font-bold"
                >
                    Export
                </button>
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-600 rounded-md shadow-lg z-10">
                        <button
                            onClick={() => handlePrintOption('excel')}
                            className="block w-full text-left p-2 hover:bg-gray-300"
                        >
                            Export as Excel
                        </button>
                        <button
                            onClick={() => handlePrintOption('pdf')}
                            className="block w-full text-left p-2 hover:bg-gray-300"
                        >
                            Export as PDF
                        </button>
                    </div>
                )}
            </div>

            <div className="a4-sheet-container">
                <div className="a4-sheet-content pt-4">
                    {keys.length === 0 ? (
                        <div className="text-gray-500">No entries found.</div>
                    ) : (
                        keys.map((key, index) => (
                            <div
                                key={`${key.key}-${index}`}
                                className='flex mb-4'
                            >
                                <div className="flex-1 w-2/5 pr-4 p-2">
                                    <label className="block text-sm font-bold text-black">
                                        {key.key}
                                    </label>
                                </div>
                                <div className="flex w-3/5 relative ">
                                    <textarea
                                        type="text"
                                        readOnly
                                        value={key.value || 'N/A'}
                                        className={`w-full h-fit p-2 border-2 ${getBorderColor(key.confidence)} rounded-md shadow-sm no-scrollbar`}
                                    />
                                    {key.confidence !== undefined && (
                                        <div className={`confidence-flag rounded-md text-xs font-bold ${getLabelColor(key.confidence)}`}>
                                            {key.confidence > 0.75 ? 'High' : key.confidence >= 0.5 ? 'Medium' : 'Low'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default A4SheetView;
