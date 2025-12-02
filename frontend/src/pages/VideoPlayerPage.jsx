import { useParams } from 'react-router-dom';

export default function VideoPlayerPage() {
  const { id } = useParams();
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  // const streamUrl = `${apiBase}/videos/${id}/stream`;
  const token = localStorage.getItem('token');
  const streamUrl = `${apiBase}/api/videos/${id}/stream?token=${token}`;


  return (
    <div>
      <h2>Video Player</h2>
      <video
        controls
        width="720"
        src={streamUrl}
        style={{ maxWidth: '100%' }}
      />
      <p>If the video does not play, check your auth token and backend logs.</p>
    </div>
  );
}
