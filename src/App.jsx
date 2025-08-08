  import { BrowserRouter, Route, Routes } from 'react-router-dom';
  import './App.css';
  import {Login} from './pages/login';
  import {Register} from './pages/register';
  import { Comments } from './pages/Comments';
  import Home from './pages/home';
  import { Profile } from './pages/profile';
  import { CompleteProfile } from './pages/profileComplete';
  import GuestRoute from './guards/GuestOnly';
  import LoggedinRoute from './guards/LoggedinROute';

  function App() {
    return (
      <BrowserRouter>
      <Routes>
        <Route path="/feed" element={<Home />} />
        <Route path="/" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/completeProfile" element={<CompleteProfile />} />
        <Route path="/profile" element={<LoggedinRoute><Profile/></LoggedinRoute>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/comments/:postId" element={<Comments />} />
      </Routes>
      </BrowserRouter>
    );
  }

  export default App;
