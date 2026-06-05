import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import './DetalhesEvento.css';

const eventosData = {
  1: {
    id: 1,
    nome: "Ultra Music Festival",
    data: "2024-05-14",
    horario: "22:00",
    local: "Palácio Sunset - Av. Principal, 1000 - São Paulo, SP",
    imagem: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=500&fit=crop",
    descricao: "O Ultra Music Festival é o maior festival de música eletrônica do mundo. Prepare-se para uma experiência única com os melhores DJs do cenário internacional.",
    ingressos: [
      { id: 1, tipo: "Pista", lotes: [{ nome: "Lote 1", preco: 150, disponivel: true }, { nome: "Lote 2", preco: 200, disponivel: true }] },
      { id: 2, tipo: "VIP", lotes: [{ nome: "Lote 1", preco: 500, disponivel: true }] }
    ]
  },
  2: {
    id: 2,
    nome: "Rock in Rio",
    data: "2024-06-20",
    horario: "20:00",
    local: "Parque Sunset - Av. das Nações, 500 - Rio de Janeiro, RJ",
    imagem: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=500&fit=crop",
    descricao: "O maior festival de rock do mundo está de volta!",
    ingressos: [
      { id: 1, tipo: "Pista", lotes: [{ nome: "Lote 1", preco: 200, disponivel: true }, { nome: "Lote 2", preco: 250, disponivel: true }] },
      { id: 2, tipo: "VIP", lotes: [{ nome: "Lote 1", preco: 600, disponivel: true }] }
    ]
  },
  3: {
    id: 3,
    nome: "Funk Invasion",
    data: "2024-07-22",
    horario: "21:00",
    local: "Arena Night - Rua Funk, 200 - Belo Horizonte, MG",
    imagem: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop",
    descricao: "O maior evento de funk do Brasil.",
    ingressos: [
      { id: 1, tipo: "Pista", lotes: [{ nome: "Lote 1", preco: 80, disponivel: true }, { nome: "Lote 2", preco: 120, disponivel: true }] }
    ]
  },
  4: {
    id: 4,
    nome: "Trap Nation",
    data: "2024-08-28",
    horario: "23:00",
    local: "Club 338 - Rua do Trap, 50 - São Paulo, SP",
    imagem: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop",
    descricao: "O melhor do trap nacional e internacional.",
    ingressos: [
      { id: 1, tipo: "Pista", lotes: [{ nome: "Lote 1", preco: 120, disponivel: true }, { nome: "Lote 2", preco: 150, disponivel: true }] }
    ]
  }
};

const DetalhesEvento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const evento = eventosData[id];

  if (!evento) {
    return (
      <div className="detalhes-page">
        <div className="page-header">
          <Link to="/" className="back-arrow">←</Link>
          <h1>Evento não encontrado</h1>
        </div>
      </div>
    );
  }

  const formatarData = (data) => {
    const dataObj = new Date(data);
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    const diaSemana = diasSemana[dataObj.getDay()];
    const dia = dataObj.getDate();
    const mes = meses[dataObj.getMonth()];
    const ano = dataObj.getFullYear();
    
    return `${diaSemana}, ${dia} de ${mes} de ${ano}`;
  };

  const formatarPreco = (preco) => {
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const adicionarAoCarrinho = (tipo, lote, preco) => {
    const cartItem = {
      eventoId: evento.id,
      artista: evento.nome,
      data: formatarData(evento.data),
      dataEvento: evento.data,
      horario: evento.horario,
      local: evento.local,
      tipo: tipo,
      lote: lote,
      preco: preco,
      quantidade: 1,
      imagem: evento.imagem
    };
    addToCart(cartItem);
    navigate('/meu-carrinho');
  };

  return (
    <div className="detalhes-page">
      <div className="page-header">
        <Link to="/" className="back-arrow">⮜</Link>
        <h1>{evento.nome}</h1>
      </div>

      <div className="detalhes-container">
        <div className="evento-cabecalho">
          <div className="cabecalho-info">
            <div className="evento-meta">
              <p className="meta-item">
                <span className="meta-icon"></span>
                {formatarData(evento.data)} • {evento.horario}h
              </p>
              <p className="meta-item">
                <span className="meta-icon"></span>
                {evento.local}
              </p>
            </div>
          </div>
          <div className="cabecalho-imagem">
            <img src={evento.imagem} alt={evento.nome} />
          </div>
        </div>

        <div className="evento-detalhes">
          <h2>Detalhes</h2>
          <div className="descricao-texto">
            {evento.descricao.split('\n').map((paragrafo, index) => (
              <p key={index}>{paragrafo}</p>
            ))}
          </div>
        </div>

        <div className="evento-ingressos">
          <h2>Ingressos</h2>
          <div className="ingressos-lista">
            {evento.ingressos.map(ingresso => (
              <div key={ingresso.id} className="ingresso-categoria">
                <h3>{ingresso.tipo}</h3>
                <div className="lotes-grid">
                  {ingresso.lotes.map((lote, index) => (
                    <div key={index} className={`lote-card ${!lote.disponivel ? 'indisponivel' : ''}`}>
                      <div className="lote-info">
                        <span className="lote-nome">{lote.nome}</span>
                        <span className="lote-preco">{formatarPreco(lote.preco)}</span>
                      </div>
                      {lote.disponivel ? (
                        <button 
                          className="comprar-btn"
                          onClick={() => adicionarAoCarrinho(ingresso.tipo, lote.nome, lote.preco)}
                        >
                          Comprar
                        </button>
                      ) : (
                        <button className="indisponivel-btn" disabled>
                          Esgotado
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesEvento;