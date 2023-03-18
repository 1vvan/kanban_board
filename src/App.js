import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Auth from './Component/Auth/Auth';
import Board from './Component/Board/Board';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Auth />}/>
          <Route path='/board' element={<Board />} />
          <Route path='*' element={
            <div className='no-page'>
              <span>Страница не найдена !</span>
          </div>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
