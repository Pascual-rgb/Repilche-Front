import {React} from 'react';
import { Routes, Route } from 'react-router-dom';
import Registro from './components/Registro';

function App() {
    return (
    <Routes>
        <Route path="/registro" element={<Registro />} />
    </Routes>
    );
}

export default App;