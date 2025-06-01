import { Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import Chatbot from './Chatbot/Chatbot';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/chatbot" element={<Chatbot />} />
    </Routes>
  );
}

export default App;