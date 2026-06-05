import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './MeusEventos.css';

const MeusEventos = () => {
  const navigate = useNavigate();
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [abaAtiva, setAbaAtiva] = useState('publicados');
  const [eventosPublicados, setEventosPublicados] = useState([]);
  const [eventosRascunho, setEventosRascunho] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const eventosResponse = await api.get('/eventos');
        setEventosPublicados(eventosResponse.data);
        
        const rascunhosSalvos = JSON.parse(localStorage.getItem('rascunhosEventos') || '[]');
        setEventosRascunho(rascunhosSalvos);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const formatarData = (data) => {
    if (!data) return 'Data nao definida';
    const dataObj = new Date(data);
    const diasSemana = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
    const meses = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    const diaSemana = diasSemana[dataObj.getDay()];
    const dia = dataObj.getDate();
    const mes = meses[dataObj.getMonth()];
    
    return `${diaSemana}, ${dia} de ${mes}`;
  };

  const formatarDataSalvo = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  const continuarEdicao = (rascunho) => {
    localStorage.setItem('rascunhoAtual', JSON.stringify(rascunho));
    navigate('/criar-evento');
  };

  const excluirRascunho = (id) => {
    const novosRascunhos = eventosRascunho.filter(r => r.id !== id);
    setEventosRascunho(novosRascunhos);
    localStorage.setItem('rascunhosEventos', JSON.stringify(novosRascunhos));
  };

  const irParaEstatisticas = (eventoId) => {
    localStorage.setItem('eventoSelecionadoId', eventoId);
    navigate('/dados');
  };

  const filtrarEventos = () => {
    const hoje = new Date();
    if (filtroStatus === 'todos') {
      return eventosPublicados;
    }
    if (filtroStatus === 'ativo') {
      return eventosPublicados.filter(evento => new Date(evento.data) >= hoje);
    }
    if (filtroStatus === 'vencido') {
      return eventosPublicados.filter(evento => new Date(evento.data) < hoje);
    }
    return eventosPublicados;
  };

  const eventosFiltrados = filtrarEventos();

  if (loading) {
    return (
      <div className="meus-eventos-page">
        <div className="page-header">
          <Link to="/" className="back-arrow">⮜</Link>
          <h1>Meus Eventos</h1>
        </div>
        <div className="loading-container">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="meus-eventos-page">
      <div className="page-header">
        <Link to="/" className="back-arrow">⮜</Link>
        <h1>Meus Eventos</h1>
      </div>

      <div className="abas-container">
        <button 
          className={`aba-btn ${abaAtiva === 'publicados' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('publicados')}
        >
          Eventos Publicados ({eventosPublicados.length})
        </button>
        <button 
          className={`aba-btn ${abaAtiva === 'rascunhos' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('rascunhos')}
        >
          Rascunhos ({eventosRascunho.length})
        </button>
      </div>

      {abaAtiva === 'publicados' && (
        <>
          <div className="filtros-container">
            <div className="filtros-buttons">
              <button 
                className={`filtro-btn ${filtroStatus === 'todos' ? 'active' : ''}`}
                onClick={() => setFiltroStatus('todos')}
              >
                Todos
              </button>
              <button 
                className={`filtro-btn ${filtroStatus === 'ativo' ? 'active' : ''}`}
                onClick={() => setFiltroStatus('ativo')}
              >
                Ativos
              </button>
              <button 
                className={`filtro-btn ${filtroStatus === 'vencido' ? 'active' : ''}`}
                onClick={() => setFiltroStatus('vencido')}
              >
                Vencidos
              </button>
            </div>
          </div>

          <div className="eventos-grid">
            {eventosFiltrados.length > 0 ? (
              eventosFiltrados.map(evento => (
                <div key={evento.id} className="evento-card">
                  <div className="evento-imagem">
                    <img src={evento.imagem_url || 'https://via.placeholder.com/300x200'} alt={evento.nome} />
                    <span className={`status-badge ${new Date(evento.data) >= new Date() ? 'ativo' : 'vencido'}`}>
                      {new Date(evento.data) >= new Date() ? 'Ativo' : 'Vencido'}
                    </span>
                  </div>
                  <div className="evento-info">
                    <h3>{evento.nome}</h3>
                    <p className="evento-data">{formatarData(evento.data)}</p>
                    <p className="evento-local">{evento.local}</p>
                    <div className="evento-acoes">
                      <button 
                        className="estatisticas-btn"
                        onClick={() => irParaEstatisticas(evento.id)}
                      >
                        Estatisticas
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="nenhum-evento">
                <p>Nenhum evento publicado</p>
                <Link to="/criar-evento" className="criar-evento-link">Criar evento</Link>
              </div>
            )}
          </div>
        </>
      )}

      {abaAtiva === 'rascunhos' && (
        <div className="rascunhos-container">
          <div className="eventos-grid">
            {eventosRascunho.length > 0 ? (
              eventosRascunho.map(rascunho => (
                <div key={rascunho.id} className="rascunho-card">
                  <div className="rascunho-imagem">
                    {rascunho.imagemCapaUrl ? (
                      <img src={rascunho.imagemCapaUrl} alt={rascunho.nomeEvento} />
                    ) : (
                      <div className="sem-imagem">Sem imagem</div>
                    )}
                  </div>
                  <div className="rascunho-info">
                    <h3>{rascunho.nomeEvento || 'Evento sem nome'}</h3>
                    <p className="rascunho-data">Ultima edicao: {formatarDataSalvo(rascunho.dataSalvo)}</p>
                    <p className="rascunho-local">{rascunho.nomeLugar || 'Local nao definido'}</p>
                    <div className="progresso-container">
                      <span>Progresso: {rascunho.progresso || 0}%</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{width: `${rascunho.progresso || 0}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="rascunho-acoes">
                      <button className="continuar-edicao-btn" onClick={() => continuarEdicao(rascunho)}>
                        Continuar Edicao
                      </button>
                      <button className="excluir-rascunho-btn" onClick={() => excluirRascunho(rascunho.id)}>
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="nenhum-rascunho">
                <p>Nenhum rascunho encontrado</p>
                <Link to="/criar-evento" className="criar-evento-link">Criar evento</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="criar-evento-rapido">
        <Link to="/criar-evento" className="criar-evento-btn">
          + Criar Evento
        </Link>
      </div>
    </div>
  );
};

export default MeusEventos;