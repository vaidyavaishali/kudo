import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './contextAPI/usercontext';
import GiveKudosPage from './pages/GiveKudosPage';
import KudosDashboard from './pages/KudoDashboard';

function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/landing-page" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/give-kudos" element={<GiveKudosPage />} />
            <Route path="/kudo-dashboard" element={<KudosDashboard />} />
          </Routes>
        </div>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
