import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import './MeusIngressos.css';

const MeusIngressos = () => {
  const { meusIngressos, removerIngresso } = useCart();
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const filtrarIngressos = () => {
    if (filtroStatus === 'todos') {
      return meusIngressos;
    }
    return meusIngressos.filter(ingresso => ingresso.status === filtroStatus);
  };

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

  const baixarQRCode = (qrCodeUrl, codigoIngresso) => {
    fetch(qrCodeUrl)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `qrcode_${codigoIngresso}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Erro ao baixar QR Code:', error);
        window.open(qrCodeUrl, '_blank');
      });
  };

  const handleExcluirIngresso = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este ingresso?')) {
      removerIngresso(id);
    }
  };

  const getStatusText = (status) => {
    return status === 'valido' ? 'Válido' : 'Passado';
  };

  const ingressosFiltrados = filtrarIngressos();

  return (
    <div className="meus-ingressos-page">
      <div className="page-header">
        <Link to="/" className="back-arrow">←</Link>
        <h1>Meus Ingressos</h1>
      </div>

      <div className="filtros-container">
        <div className="filtros-buttons">
          <button 
            className={`filtro-btn ${filtroStatus === 'todos' ? 'active' : ''}`}
            onClick={() => setFiltroStatus('todos')}
          >
            Todos
          </button>
          <button 
            className={`filtro-btn ${filtroStatus === 'valido' ? 'active' : ''}`}
            onClick={() => setFiltroStatus('valido')}
          >
            Válidos
          </button>
          <button 
            className={`filtro-btn ${filtroStatus === 'passado' ? 'active' : ''}`}
            onClick={() => setFiltroStatus('passado')}
          >
            Passados
          </button>
        </div>
      </div>

      <div className="ingressos-lista">
        {ingressosFiltrados.length > 0 ? (
          ingressosFiltrados.map(ingresso => (
            <div key={ingresso.id} className="ingresso-card">
              <div className="ingresso-qrcode">
                <img src={ingresso.qrCode} alt="QR Code" className="qrcode-img" />
                <button 
                  className="baixar-qrcode-btn"
                  onClick={() => baixarQRCode(ingresso.qrCode, ingresso.codigoIngresso)}
                >
                  📂 Baixar QR code
                </button>
              </div>

              <div className="ingresso-info">
                <div className="info-left">
                  <img src={ingresso.imagem} alt={ingresso.artista} className="evento-imagem-mini" />
                  <div className="info-detalhes">
                    <h3 className="artista-nome">{ingresso.artista}</h3>
                    <p className="info-item">
                      <span className="info-label">📅 Data e horário:</span>
                      <span>{formatarData(ingresso.data)} • {ingresso.horario}h</span>
                    </p>
                    <p className="info-item">
                      <span className="info-label">📍 Local:</span>
                      <span>{ingresso.local}</span>
                    </p>
                    <p className="info-item">
                      <span className="info-label">🎫 Tipo de ingresso:</span>
                      <span>{ingresso.tipoIngresso}</span>
                    </p>
                    <p className="info-item">
                      <span className="info-label">🔢 Quantidade:</span>
                      <span>{ingresso.quantidade}x</span>
                    </p>
                    <p className="info-item">
                      <span className="info-label">💰 Preço unitário:</span>
                      <span>{formatarPreco(ingresso.precoUnitario)}</span>
                    </p>
                    <p className="info-item">
                      <span className="info-label">💵 Preço total:</span>
                      <span className="preco-total">{formatarPreco(ingresso.precoTotal)}</span>
                    </p>
                    <p className="info-item">
                      <span className="info-label">📌 Status:</span>
                      <span className={`status-badge ${ingresso.status}`}>
                        {getStatusText(ingresso.status)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="acoes-container">
                  <button 
                    className="acao-btn qrcode-btn"
                    onClick={() => baixarQRCode(ingresso.qrCode, ingresso.codigoIngresso)}
                  >
                    📂 Baixar QR code
                  </button>
                  <Link to={`/evento/${ingresso.eventoId}`} className="acao-btn saiba-mais-btn">
                    📷 Saiba mais
                  </Link>
                  <button 
                    className="acao-btn excluir-btn"
                    onClick={() => handleExcluirIngresso(ingresso.id)}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="nenhum-ingresso">
            <p>Você ainda não possui ingressos</p>
            <Link to="/" className="comprar-ingressos-btn">Comprar ingressos</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeusIngressos;