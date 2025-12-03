import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { io } from "socket.io-client";

export default function DashboardPage() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');

  const fetchVideos = async () => {
    try {
      const { data } = await api.get('/videos');
      setVideos(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load videos');
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
      .replace('/api', '');
    const s = io(backendBase);

    s.on('processingUpdate', () => {
      fetchVideos();
    });

    return () => s.disconnect();
  }, []);

  return (
    <div>
      <h2>Video Library</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="4"
        style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Sensitivity</th>
            <th>Reason</th>
            <th>Play</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((v) => (
            <tr key={v._id}>
              <td>{v.title}</td>
              <td>{v.status}</td>
              <td>{v.sensitivityStatus}</td>
              <td>
                {v.analysisDetails
                  ? `Weapons: ${v.analysisDetails.weapons}, Blood: ${v.analysisDetails.blood}`
                  : '-'}
              </td>
              <td>
                {v.status === 'processed' ? (
                  <Link to={`/videos/${v._id}`}>Play</Link>
                ) : (
                  '-'
                )}
              </td>
            </tr>
          ))}

          {videos.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No videos found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
