import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import DisplayDocument from './Components/DisplayDocument';
import Report from './Components/Report';
import UploadFile from './Components/UploadFile';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <div className='flex items-center h-16 bg-blue-500 text-white px-4'>
            <div className='flex items-center flex-shrink-0'>
              <span className='text-lg font-bold'>
                LOC Doc Processing
              </span>
            </div>
            <div className='flex-grow flex mr-32 justify-center'>
              <div className='flex space-x-4'>
                <Link to="/" className='cursor-pointer border-b bg-blue-600 shadow-lg border-dashed border-white hover:bg-blue-700 hover:border hover:border-dashed hover:border-white rounded-md px-4 py-2'>
                  <p>Upload File</p>
                </Link>
                <Link to="/display" className='cursor-pointer border-b bg-blue-600 border-dashed border-white hover:bg-blue-700 hover:border hover:border-dashed hover:border-white rounded-md px-4 py-2'>
                  <p>View Document</p>
                </Link>
              </div>
            </div>
          </div>


          <ToastContainer />
          <Routes>
            <Route path="/" element={<UploadFile />} />
            <Route path="/display" element={<DisplayDocument />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
