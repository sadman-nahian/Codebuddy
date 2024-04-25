import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Debug from './Pages/Debug';
import Post from './Pages/Post';
import About from './Pages/About';
import Random from './Pages/Random';
import Description from './Pages/Description';

function App() {
  

  return (
    <div>
      <BrowserRouter>
      <h2 className='title'>CODEBUDDY</h2>
        <Routes>
          <Route path="/" element={<Debug />} />
          <Route path="/post" element={<Post />} />
          <Route path="/about" element={<About />} />
          <Route path="/random" element={<Random />} />
          <Route path='/:holder' element={<Description/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
