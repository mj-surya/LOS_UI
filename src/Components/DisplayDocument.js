import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import '../Components/UploadFile.css';

function DisplayDocument() {
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState("");
    const { applicationId } = location.state || {};
    const [displayData, setDisplayData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            if (applicationId) {
                setSearch(applicationId);
                const url = `http://localhost:4400/download/json/?applicationNumber=${applicationId}`;

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ applicationNumber: applicationId }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log('Search result:', result);

                setDisplayData(result);

            }
        };

        fetchData();
    }, [applicationId]);

    const display = (applicationId, title, datas, file) => {
        navigate("/report", { state: { applicationId, title, datas, file } })
        console.log(datas)
    };

    const SearchButton = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        if (search === "") {
            setDisplayData({});
            return;
        }

        try {
            const url = `http://localhost:4400/download/json/`;

            // Make the POST request with JSON in the body
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ applicationNumber: search }), // Pass JSON in the body
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Search result:', result);

            setDisplayData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
            setDisplayData({});
        }
    };




    const clearBtn = () => {
        setSearch("");
        setDisplayData({});
    }

    return (
        <div className="flex flex-col items-center h-screen">
            <div className="mt-10 p-5 w-full flex justify-center pl-48">
                <form className="flex items-center w-3/5" onSubmit={SearchButton}>
                    <div className="relative w-full flex">
                        <input
                            type="number"
                            id="search"
                            className="placeholder-black border text-md border-black border-dashed text-black rounded-lg block w-2/5 p-2.5 text-center focus:outline-none"
                            placeholder="Enter Application ID"
                            value={search}
                            required
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-blue-800 p-2 rounded-lg text-white flex items-center px-4 ml-2"
                            onClick={SearchButton}
                        >
                            Get Documents
                        </button>
                        <button
                            type="button"
                            className="bg-red-800 p-2 rounded-lg text-white flex items-center px-4 ml-2"
                            onClick={clearBtn}
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>


            <div className="mt-5 mb-24 ml-16 mr-16 p-5 rounded-3xl ">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {displayData.length > 0 ? (
                        displayData.map((item, index) => {
                            // Parse the JSON string in the 'data' field
                            const parsedData = JSON.parse(item.data);

                            return (
                                <div
                                    key={index}
                                    className="move flex flex-col w-56 min-h-28 items-center border-dashed bg-blue-400 shadow-md border-2 border-gray-300 rounded-xl hover:border-gray-700 cursor-pointer"
                                    onClick={() => display(search, item.fileName, parsedData, item.actualFile)}
                                >
                                    <div className="p-4 flex flex-col items-center">
                                        <h5 className="block mb-2 font-sans text-xl text-wrap font-semibold text-black">
                                            {item.fileName}
                                        </h5>
                                        <p className='align-center text-sm'>Extracted Data: {parsedData.data.length}</p>
                                    </div>
                                </div>
                            );
                        })
                    )
                        : (
                            <div className="col-span-full flex justify-center items-center">
                                <h1>No items to display</h1>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}

export default DisplayDocument;