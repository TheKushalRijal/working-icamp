import React from 'react';
import { useNavigate } from 'react-router-dom';

const Initialpage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-300 to-blue-600 p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Are you applying for UTA?</h2>
        <div className="flex flex-col gap-4 mb-6">
          <button 
            onClick={() => navigate('/outside')} 
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 hover:scale-105 transition duration-300 ease-in-out"
          >
            Yes
          </button>
          <button 
            onClick={() => navigate('/home')} 

            className="w-full bg-gray-300 text-gray-900 px-6 py-3 rounded-xl shadow-md hover:bg-gray-400 hover:scale-105 transition duration-300 ease-in-out"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Initialpage;
