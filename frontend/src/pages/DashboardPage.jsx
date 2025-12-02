import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

export default function DashboardPage() {
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState('');
  const [sensitivity, setSensitivity] = useState('');
  const [error, setError] = useState('');

  const fetchVideos = async () => {
    try {
      const params = {};
      if (status) params.status = status;
      if (sensitivity) params.sensitivity = sensitivity;
      const { data } = await api.get('/videos', { params });
      setVideos(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load videos');
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [status, sensitivity]);

  return (
    <div>
      <h2>Video Library</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>Status:&nbsp;</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="uploaded">Uploaded</option>
          <option value="processing">Processing</option>
          <option value="processed">Processed</option>
          <option value="failed">Failed</option>
        </select>
        <span style={{ marginLeft: '1rem' }}>
          <label>Sensitivity:&nbsp;</label>
          <select value={sensitivity} onChange={(e) => setSensitivity(e.target.value)}>
            <option value="">All</option>
            <option value="safe">Safe</option>
            <option value="flagged">Flagged</option>
            <option value="unknown">Unknown</option>
          </select>
        </span>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1" cellPadding="4" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Sensitivity</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((v) => (
            <tr key={v._id}>
              <td>{v.title}</td>
              <td>{v.status}</td>
              <td>{v.sensitivityStatus}</td>
              <td>{new Date(v.createdAt).toLocaleString()}</td>
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
