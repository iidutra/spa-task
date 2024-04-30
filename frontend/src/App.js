import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import TagManagement from './pages/TagManagement'; // Importe o novo componente

function App() {
  return (
    <Routes>
      <Route exact path="/" element={ <Login /> } />
      <Route path="/home" element={<Home />} />
      <Route path="/tags" element={<TagManagement />} /> {/* Adicione esta linha */}

    </Routes>
  );
}

export default App;