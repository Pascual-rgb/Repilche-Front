import { React } from 'react';
import { Routes, Route } from 'react-router-dom';
import Registro from './components/Registro';
import Login from './components/Login';

function App() {
    return (
    <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
    </Routes>
    );
}

export default App;