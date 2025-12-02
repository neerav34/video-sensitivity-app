import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import VideoPlayerPage from './pages/VideoPlayerPage.jsx';

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <Link to="/">Dashboard</Link> | <Link to="/upload">Upload</Link>
        </div>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: '1rem' }}>
                {user.name} ({user.role})
              </span>
              <button onClick={logout}>Logout</button>
            </>
          ) : null}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Layout>
                <UploadPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/videos/:id"
          element={
            <PrivateRoute>
              <Layout>
                <VideoPlayerPage />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
