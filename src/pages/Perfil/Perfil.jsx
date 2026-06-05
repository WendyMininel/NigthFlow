import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Perfil.css';

const Perfil = () => {
  const navigate = useNavigate();
  const [perfilData, setPerfilData] = useState({
    nome: '',
    telefone: '',
    email: '',
    senha: '',
    endereco: {
      cep: '',
      rua: '',
      bairro: '',
      cidade: '',
      numero: '',
      estado: ''
    },
    generosFavoritos: [],
    area: 'cliente'
  });

  const generosDisponiveis = [
    { id: 'eletronica', label: 'Eletrônica' },
    { id: 'rap/trap', label: 'Rap / Trap' },
    { id: 'funk', label: 'Funk' },
    { id: 'pop', label: 'Pop' },
    { id: 'kpop', label: 'Kpop' },
    { id: 'rock', label: 'Rock' },
    { id: 'sertanejo', label: 'Sertanejo' },
    { id: 'pagode', label: 'Pagode' },
    { id: 'outros', label: 'Outros' }
  ];

  useEffect(() => {
    const savedArea = localStorage.getItem('userArea');
    if (savedArea) {
      setPerfilData(prev => ({ ...prev, area: savedArea }));
    }
  }, []);

  const handlePerfilChange = (campo, valor) => {
    setPerfilData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleEnderecoChange = (campo, valor) => {
    setPerfilData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [campo]: valor
      }
    }));
  };

  const handleGeneroChange = (generoId) => {
    setPerfilData(prev => {
      if (prev.generosFavoritos.includes(generoId)) {
        return {
          ...prev,
          generosFavoritos: prev.generosFavoritos.filter(g => g !== generoId)
        };
      } else {
        return {
          ...prev,
          generosFavoritos: [...prev.generosFavoritos, generoId]
        };
      }
    });
  };

  const handleAreaChange = (area) => {
    setPerfilData(prev => ({
      ...prev,
      area: area
    }));
  };

  const handleSalvar = () => {
    localStorage.setItem('userArea', perfilData.area);
    window.dispatchEvent(new Event('userAreaChanged'));
    alert('Perfil atualizado com sucesso!');
    navigate('/');
  };

  return (
    <div className="perfil-page">
      <div className="page-header">
        <Link to="/" className="back-arrow">⮜</Link>
        <h1>Perfil</h1>
      </div>

      <div className="perfil-container">
        <div className="perfil-blocos">
          <div className="bloco perfil-bloco">
            <h2>Perfil</h2>
            <div className="campos-grid">
              <div className="campo">
                <label>Nome</label>
                <input 
                  type="text" 
                  value={perfilData.nome}
                  onChange={(e) => handlePerfilChange('nome', e.target.value)}
                  className="input-field"
                  placeholder="Digite seu nome"
                />
              </div>
              <div className="campo">
                <label>Telefone</label>
                <input 
                  type="tel" 
                  value={perfilData.telefone}
                  onChange={(e) => handlePerfilChange('telefone', e.target.value)}
                  className="input-field"
                  placeholder="Digite seu telefone"
                />
              </div>
              <div className="campo">
                <label>Email</label>
                <input 
                  type="email" 
                  value={perfilData.email}
                  onChange={(e) => handlePerfilChange('email', e.target.value)}
                  className="input-field"
                  placeholder="Digite seu email"
                />
              </div>
              <div className="campo">
                <label>Senha</label>
                <input 
                  type="password" 
                  value={perfilData.senha}
                  onChange={(e) => handlePerfilChange('senha', e.target.value)}
                  className="input-field"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>
          </div>

          <div className="bloco endereco-bloco">
            <h2>Endereço</h2>
            <div className="endereco-grid">
              <div className="campo">
                <label>CEP</label>
                <input 
                  type="text" 
                  value={perfilData.endereco.cep}
                  onChange={(e) => handleEnderecoChange('cep', e.target.value)}
                  className="input-field"
                  placeholder="Digite seu CEP"
                />
              </div>
              <div className="campo">
                <label>Rua</label>
                <input 
                  type="text" 
                  value={perfilData.endereco.rua}
                  onChange={(e) => handleEnderecoChange('rua', e.target.value)}
                  className="input-field"
                  placeholder="Digite sua rua"
                />
              </div>
              <div className="campo">
                <label>Bairro</label>
                <input 
                  type="text" 
                  value={perfilData.endereco.bairro}
                  onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
                  className="input-field"
                  placeholder="Digite seu bairro"
                />
              </div>
              <div className="campo">
                <label>Cidade</label>
                <input 
                  type="text" 
                  value={perfilData.endereco.cidade}
                  onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                  className="input-field"
                  placeholder="Digite sua cidade"
                />
              </div>
              <div className="campo">
                <label>Número</label>
                <input 
                  type="text" 
                  value={perfilData.endereco.numero}
                  onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                  className="input-field"
                  placeholder="Digite o número"
                />
              </div>
              <div className="campo">
                <label>Estado</label>
                <input 
                  type="text" 
                  value={perfilData.endereco.estado}
                  onChange={(e) => handleEnderecoChange('estado', e.target.value)}
                  className="input-field"
                  placeholder="Digite seu estado"
                  maxLength="2"
                />
              </div>
            </div>
          </div>

          <div className="bloco generos-bloco">
            <h2>Gêneros favoritos</h2>
            <div className="generos-grid-perfil">
              {generosDisponiveis.map(genero => (
                <label key={genero.id} className="genero-checkbox">
                  <input 
                    type="checkbox"
                    checked={perfilData.generosFavoritos.includes(genero.id)}
                    onChange={() => handleGeneroChange(genero.id)}
                  />
                  <span>{genero.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bloco area-bloco">
            <h2>Área de:</h2>
            <div className="area-options">
              <label className="area-radio">
                <input 
                  type="radio"
                  name="area"
                  checked={perfilData.area === 'cliente'}
                  onChange={() => handleAreaChange('cliente')}
                />
                <span>Cliente / Comprador</span>
              </label>
              <label className="area-radio">
                <input 
                  type="radio"
                  name="area"
                  checked={perfilData.area === 'organizador'}
                  onChange={() => handleAreaChange('organizador')}
                />
                <span>Organizador de eventos</span>
              </label>
            </div>
          </div>
        </div>

        <div className="acoes-perfil">
          <button className="salvar-btn" onClick={handleSalvar}>
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;