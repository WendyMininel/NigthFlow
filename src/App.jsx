import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header/Header';
import './App.css';
import Home from './pages/Home/Home';
import CriarEvento from './pages/CriarEvento/CriarEvento';
import MeusIngressos from './pages/MeusIngressos/MeusIngressos';
import MeuCarrinho from './pages/MeuCarrinho/MeuCarrinho';
import Perfil from './pages/Perfil/Perfil';
import MeusEventos from './pages/MeusEventos/MeusEventos';
import Dados from './pages/Dados/Dados';
import DetalhesEvento from './pages/DetalhesEvento/DetalhesEvento';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/criar-evento" element={<CriarEvento />} />
              <Route path="/meus-ingressos" element={<MeusIngressos />} />
              <Route path="/meu-carrinho" element={<MeuCarrinho />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/meus-eventos" element={<MeusEventos />} />
              <Route path="/dados" element={<Dados />} />
              <Route path="/evento/:id" element={<DetalhesEvento />} />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;