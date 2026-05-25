import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MeusEventos.css';

const MeusEventos = () => {
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [abaAtiva, setAbaAtiva] = useState('publicados');

  const eventosPublicados = [];

  const eventosRascunho = [];

  const filtrarEventos = () => {
    if (filtroStatus === 'todos') {
      return eventosPublicados;
    }
    return eventosPublicados.filter(evento => evento.status === filtroStatus);
  };

  const formatarData = (data) => {
    const dataObj = new Date(data);
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    const diaSemana = diasSemana[dataObj.getDay()];
    const dia = dataObj.getDate();
    const mes = meses[dataObj.getMonth()];
    
    return `${diaSemana}, ${dia} de ${mes}`;
  };

  const eventosFiltrados = filtrarEventos();

  return (
    <div className="meus-eventos-page">
      <div className="page-header">
        <Link to="/" className="back-arrow">←</Link>
        <h1>Meus Eventos</h1>
      </div>

      <div className="abas-container">
        <button 
          className={`aba-btn ${abaAtiva === 'publicados' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('publicados')}
        >
          Eventos Publicados
        </button>
        <button 
          className={`aba-btn ${abaAtiva === 'rascunhos' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('rascunhos')}
        >
          Rascunhos
        </button>
      </div>

      {abaAtiva === 'publicados' && (
        <>
          <div className="filtros-container">
            <h2>Eventos Publicados</h2>
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
                    <img src={evento.imagem} alt={evento.nome} />
                    <span className={`status-badge ${evento.status}`}>
                      {evento.status === 'ativo' ? 'Ativo' : 'Vencido'}
                    </span>
                  </div>
                  <div className="evento-info">
                    <h3>{evento.nome}</h3>
                    <p className="evento-data">{formatarData(evento.data)}</p>
                    <p className="evento-local">{evento.local}</p>
                    <div className="evento-ingressos">
                      <span>Ingressos vendidos: {evento.ingressosVendidos}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{width: `${(evento.ingressosVendidos / evento.limiteIngressos) * 100}%`}}
                        ></div>
                      </div>
                      <span>Limite: {evento.limiteIngressos}</span>
                    </div>
                    <div className="evento-acoes">
                      <button className="editar-btn">✏️ Editar</button>
                      <button className="estatisticas-btn">📊 Estatísticas</button>
                      <button className="compartilhar-btn">🔗 Compartilhar</button>
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
          <h2>Rascunhos</h2>
          <div className="eventos-grid">
            {eventosRascunho.length > 0 ? (
              eventosRascunho.map(rascunho => (
                <div key={rascunho.id} className="rascunho-card">
                  <div className="rascunho-imagem">
                    <img src={rascunho.imagem} alt={rascunho.nome} />
                  </div>
                  <div className="rascunho-info">
                    <h3>{rascunho.nome}</h3>
                    <p className="rascunho-data">Última edição: {formatarData(rascunho.dataUltimaEdicao)}</p>
                    <div className="progresso-container">
                      <span>Progresso: {rascunho.progresso}%</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{width: `${rascunho.progresso}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="rascunho-acoes">
                      <button className="continuar-edicao-btn">✏️ Continuar Edição</button>
                      <button className="excluir-rascunho-btn">🗑️ Excluir</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="nenhum-rascunho">
                <p>Nenhum rascunho encontrado</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="criar-evento-rapido">
        <Link to="/criar-evento" className="criar-evento-btn">
          + Criar Novo Evento
        </Link>
      </div>
    </div>
  );
};

export default MeusEventos;