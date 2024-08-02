"use client";
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam'; // Import react-webcam

const Lens: React.FC = () => {
  const [cameraVisible, setCameraVisible] = useState(false);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  // Capture photo function
  const handleTakePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc ?? undefined);
      setCameraVisible(false);
    }
  };

  // Retake photo function
  const handleRetakePhoto = () => {
    setImage(undefined);
    setCameraVisible(true);
  };

  // Fetch results function
  const handleViewResults = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const response = await fetch('/api/trpc/post/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center">
      {!cameraVisible && !image && (
        <button
          onClick={() => setCameraVisible(true)}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-400"
        >
          Open Camera
        </button>
      )}

      {cameraVisible && (
        <div className="relative w-full h-full flex flex-col items-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
            videoConstraints={{ facingMode: 'user' }} // Use front camera by default
          />
          <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4">
            <button
              onClick={handleTakePhoto}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-400"
            >
              Capture
            </button>
          </div>
        </div>
      )}

      {image && !loading && (
        <div className="flex flex-col items-center mt-8">
          <img src={image} alt="Captured preview" className="mb-4 max-w-full h-auto" />
          <div className="flex gap-4">
            <button
              onClick={handleRetakePhoto}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-400"
            >
              Retake Photo
            </button>
            <button
              onClick={handleViewResults}
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400"
            >
              View Results
            </button>
          </div>
        </div>
      )}

      {loading && <p className="absolute bottom-0 left-0 right-0 text-center text-white">Loading...</p>}

      {results.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-2xl font-semibold text-center mb-4 text-white">Results</h2>
          <ul className="list-disc pl-6 text-white">
            {results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Lens;
