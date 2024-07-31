import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import A4SheetView from "./A4SheetView";
import Base64Viewer from "./Base64Viewer";

function Report() {
    const location = useLocation();
    const navigate = useNavigate();
    const { applicationId, title, datas, file } = location.state || {};
    const handleBackClick = () => {
        navigate("/display", { state: { applicationId } });
    };

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <button
                onClick={handleBackClick}
                className="absolute top-24 left-4 px-4 py-2 bg-white text-black border border-black rounded-md focus:outline-none z-10"
            >
                Back
            </button>
            <div className="flex flex-col items-center w-full md:w-1/2 p-4 md:p-8">
                <p className="mt-4 font-bold text-xl md:text-2xl mb-4 text-center">{title.split('.').slice(0, -1).join('.')} Preview</p>
                <Base64Viewer file={file} />
            </div>
            <div className="flex flex-col items-center w-full md:w-1/2 p-4 md:p-8">
                <p className="mt-4 font-bold text-xl md:text-2xl text-center">Extracted Fields</p>
                <div className="w-full">
                    <A4SheetView datas={datas} />
                </div>
            </div>
        </div>
    );
}

export default Report;
