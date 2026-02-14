import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import NewsPage from './pages/NewsPage';
import HoroscopePage from './pages/HoroscopePage';
import CalendarPage from './pages/CalendarPage';
import AdminPage from './pages/AdminPage';
import CallbreakPage from './pages/CallbreakPage';
import HotTopicModal from './components/HotTopicModal';
import { AppProvider } from './context/AppContext';

// Simple Home component that redirects to News page (Dashboard)
const Home = () => {
  return <Navigate to="/news" replace />;
};

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/horoscope" element={<HoroscopePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/callbreak" element={<CallbreakPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Layout>
        <HotTopicModal />
      </HashRouter>
    </AppProvider>
  );
};

export default App;