
import './App.css';
import Post  from './Post';
import Header from './Header';
import {Routes, Route} from 'react-router-dom';
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegitserPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './pages/CreatePost.js'
import ProfilUser from './pages/ProfilUser.js'



function App() {
  return (
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/register" element={<RegisterPage />}/>
          <Route path="/create" element={<CreatePost />}/>
          <Route path='/profil' element={<ProfilUser />}/>
      </Route>
   </Routes>



      </UserContextProvider>
      
      
    
  );
}

export default App;
