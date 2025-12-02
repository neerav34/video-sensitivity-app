// import { useState, useEffect } from 'react';
// import api from '../services/api.js';
// import { io } from 'socket.io-client';

// const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
// const socket = io(backendBase, { autoConnect: false });

// export default function UploadPage() {
//   const [file, setFile] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [processingUpdate, setProcessingUpdate] = useState(null);
//   const [videoId, setVideoId] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (!videoId) return;

//     socket.connect();
//     socket.emit('joinVideoRoom', videoId);

//     socket.on('processingUpdate', (update) => {
//       if (update.videoId === videoId) {
//         setProcessingUpdate(update);
//       }
//     });

//     return () => {
//       socket.off('processingUpdate');
//       socket.disconnect();
//     };
//   }, [videoId]);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return;
//     setError('');
//     setUploadProgress(0);
//     setProcessingUpdate(null);

//     const formData = new FormData();
//     formData.append('video', file);
//     formData.append('title', file.name);

//     try {
//       const res = await api.post('/videos/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         onUploadProgress: (evt) => {
//           if (evt.total) {
//             setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
//           }
//         }
//       });
//       setVideoId(res.data.videoId);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Upload failed');
//     }
//   };

//   return (
//     <div>
//       <h2>Upload Video</h2>
//       <form onSubmit={handleUpload}>
//         <input
//           type="file"
//           accept="video/*"
//           onChange={(e) => setFile(e.target.files[0] || null)}
//         />
//         <button type="submit" disabled={!file}>
//           Upload
//         </button>
//       </form>
//       {uploadProgress > 0 && <p>Upload progress: {uploadProgress}%</p>}
//       {processingUpdate && (
//         <div style={{ marginTop: '1rem' }}>
//           <p>Processing progress: {processingUpdate.progress}%</p>
//           <p>Status: {processingUpdate.status}</p>
//           <p>Sensitivity: {processingUpdate.sensitivityStatus}</p>
//         </div>
//       )}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// }




import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { io } from 'socket.io-client';

const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
  .replace('/api', '');

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingUpdate, setProcessingUpdate] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!videoId) return;

    const s = io(backendBase, { transports: ['websocket'], reconnection: true });
    setSocket(s);

    s.on("connect", () => {
      s.emit("joinVideoRoom", videoId);
    });

    s.on('processingUpdate', (update) => {
      if (update.videoId === videoId) {
        setProcessingUpdate(update);
      }
    });

    return () => {
      s.disconnect();
    };
  }, [videoId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setError('');
    setUploadProgress(0);
    setProcessingUpdate(null);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', file.name);

    try {
      const res = await api.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (evt.total) {
            setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        }
      });
      setVideoId(res.data.videoId);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div>
      <h2>Upload Video</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0] || null)}
        />
        <button type="submit" disabled={!file}>Upload</button>
      </form>

      {uploadProgress > 0 && <p>Upload progress: {uploadProgress}%</p>}

      {processingUpdate && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Processing:</strong> {processingUpdate.progress}%</p>
          <p><strong>Status:</strong> {processingUpdate.status}</p>
          <p><strong>Sensitivity:</strong> {processingUpdate.sensitivityStatus}</p>

          {processingUpdate.details && (
            <p>
              <strong>Reason: </strong>
              Weapons {processingUpdate.details.weapons}, Blood {processingUpdate.details.blood}
            </p>
          )}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
