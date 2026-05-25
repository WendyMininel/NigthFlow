import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dados.css';

const Dados = () => {
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  const eventos = [];

  const calcularMedias = () => {
    if (!eventos.length) return null;
    
    let totalVendidos = 0;
    let totalLotes = 0;
    const pagamentosTotal = { pix: 0, boleto: 0, credito: 0, debito: 0 };
    let totalComparecimento = { estimativa: 0, realidade: 0 };
    const comparecimentoPorTipo = {};

    eventos.forEach(evento => {
      evento.lotes.forEach(lote => {
        totalVendidos += lote.vendidos;
        totalLotes += lote.total;
      });

      pagamentosTotal.pix += evento.pagamentos.pix;
      pagamentosTotal.boleto += evento.pagamentos.boleto;
      pagamentosTotal.credito += evento.pagamentos.credito;
      pagamentosTotal.debito += evento.pagamentos.debito;

      evento.comparecimento.forEach(item => {
        totalComparecimento.estimativa += item.estimativa;
        totalComparecimento.realidade += item.realidade;
        
        if (!comparecimentoPorTipo[item.tipo]) {
          comparecimentoPorTipo[item.tipo] = { estimativa: 0, realidade: 0 };
        }
        comparecimentoPorTipo[item.tipo].estimativa += item.estimativa;
        comparecimentoPorTipo[item.tipo].realidade += item.realidade;
      });
    });

    const mediaPorcentagem = (totalVendidos / totalLotes) * 100;

    const totalPagamentos = pagamentosTotal.pix + pagamentosTotal.boleto + pagamentosTotal.credito + pagamentosTotal.debito;
    const pagamentosPorcentagem = {
      pix: (pagamentosTotal.pix / totalPagamentos) * 100,
      boleto: (pagamentosTotal.boleto / totalPagamentos) * 100,
      credito: (pagamentosTotal.credito / totalPagamentos) * 100,
      debito: (pagamentosTotal.debito / totalPagamentos) * 100
    };

    const comparecimentoArray = Object.keys(comparecimentoPorTipo).map(tipo => ({
      tipo,
      estimativa: comparecimentoPorTipo[tipo].estimativa,
      realidade: comparecimentoPorTipo[tipo].realidade
    }));

    return {
      lotes: eventos.flatMap(e => e.lotes),
      totalVendidos,
      totalLotes,
      mediaPorcentagem,
      pagamentos: pagamentosPorcentagem,
      comparecimento: comparecimentoArray,
      inscritos: eventos.flatMap(e => e.inscritos)
    };
  };

  const dadosExibidos = eventoSelecionado ? eventoSelecionado : calcularMedias();

  const exportarParaExcel = () => {
    const dadosExportacao = dadosExibidos?.inscritos || [];
    
    const cabecalho = ["Nome", "Tipo de Ingresso", "Confirmação de Pagamento", "Presença"];
    
    const linhas = dadosExportacao.map(item => [
      item.nome,
      item.tipoIngresso,
      item.pagamentoConfirmado,
      item.presenca
    ]);
    
    const conteudoCSV = [cabecalho, ...linhas].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([conteudoCSV], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `lista_inscritos_${eventoSelecionado ? eventoSelecionado.nome : "todos_eventos"}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const encontrarMaiorValorLote = () => {
    if (!dadosExibidos?.lotes || dadosExibidos.lotes.length === 0) return 1000;
    const maximo = Math.max(...dadosExibidos.lotes.map(lote => lote.total));
    return maximo + 100;
  };

  const encontrarMaiorValorComparecimento = () => {
    if (!dadosExibidos?.comparecimento || dadosExibidos.comparecimento.length === 0) return 1000;
    const maximo = Math.max(
      ...dadosExibidos.comparecimento.flatMap(item => [item.estimativa, item.realidade])
    );
    return maximo + 100;
  };

  return (
    <div className="dados-page">
      <div className="page-header">
        <Link to="/" className="back-arrow">←</Link>
        <h1>Dados e Estatísticas</h1>
      </div>

      <div className="eventos-selector">
        <h2>Selecione um evento</h2>
        <div className="eventos-buttons">
          <button 
            className={`evento-select-btn ${eventoSelecionado === null ? 'active' : ''}`}
            onClick={() => setEventoSelecionado(null)}
          >
            Todos os Eventos (Média)
          </button>
          {eventos.map(evento => (
            <button 
              key={evento.id}
              className={`evento-select-btn ${eventoSelecionado?.id === evento.id ? 'active' : ''}`}
              onClick={() => setEventoSelecionado(evento)}
            >
              {evento.nome}
            </button>
          ))}
        </div>
      </div>

      {dadosExibidos && (
        <div className="graficos-grid">
          <div className="grafico-card grafico-rosa">
            <h3>Quantidade de ingressos vendidos em cada lote</h3>
            <div className="grafico-linha">
              {dadosExibidos.lotes && dadosExibidos.lotes.map((lote, index) => (
                <div key={index} className="linha-item">
                  <div className="linha-label">{lote.nome}</div>
                  <div className="linha-barra-container">
                    <div 
                      className="linha-barra"
                      style={{ width: `${(lote.vendidos / encontrarMaiorValorLote()) * 100}%` }}
                    >
                      <span className="linha-valor">{lote.vendidos}</span>
                    </div>
                  </div>
                  <div className="linha-total">/{lote.total}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grafico-card grafico-azul">
            <h3>Forma de pagamento realizada</h3>
            <div className="grafico-pizza-container">
              <div className="legenda-pagamentos">
                <div className="pagamento-item">
                  <div className="pagamento-cor pix"></div>
                  <span>PIX: {dadosExibidos.pagamentos?.pix.toFixed(1)}%</span>
                </div>
                <div className="pagamento-item">
                  <div className="pagamento-cor boleto"></div>
                  <span>Boleto: {dadosExibidos.pagamentos?.boleto.toFixed(1)}%</span>
                </div>
                <div className="pagamento-item">
                  <div className="pagamento-cor credito"></div>
                  <span>Crédito: {dadosExibidos.pagamentos?.credito.toFixed(1)}%</span>
                </div>
                <div className="pagamento-item">
                  <div className="pagamento-cor debito"></div>
                  <span>Débito: {dadosExibidos.pagamentos?.debito.toFixed(1)}%</span>
                </div>
              </div>
              <div className="pizza-grafico">
                <svg viewBox="0 0 100 100" className="pizza-svg">
                  {dadosExibidos.pagamentos && (() => {
                    let currentAngle = 0;
                    const cores = ['#ff69b4', '#3498db', '#9b59b6', '#2ecc71'];
                    const valores = [
                      dadosExibidos.pagamentos.pix,
                      dadosExibidos.pagamentos.boleto,
                      dadosExibidos.pagamentos.credito,
                      dadosExibidos.pagamentos.debito
                    ];
                    
                    return valores.map((valor, idx) => {
                      if (valor === 0) return null;
                      const angle = (valor / 100) * 360;
                      const startAngle = currentAngle;
                      const endAngle = currentAngle + angle;
                      currentAngle = endAngle;
                      
                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;
                      
                      const x1 = 50 + 40 * Math.cos(startRad);
                      const y1 = 50 + 40 * Math.sin(startRad);
                      const x2 = 50 + 40 * Math.cos(endRad);
                      const y2 = 50 + 40 * Math.sin(endRad);
                      
                      const largeArc = angle > 180 ? 1 : 0;
                      
                      return (
                        <path
                          key={idx}
                          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={cores[idx]}
                          stroke="#000"
                          strokeWidth="0.5"
                        />
                      );
                    });
                  })()}
                </svg>
              </div>
            </div>
          </div>

          <div className="grafico-card grafico-roxo">
            <h3>Comparecimento</h3>
            <div className="grafico-colunas">
              {dadosExibidos.comparecimento && dadosExibidos.comparecimento.map((item, index) => (
                <div key={index} className="coluna-grupo">
                  <div className="coluna-titulo">{item.tipo}</div>
                  <div className="colunas-container">
                    <div className="coluna-item">
                      <div 
                        className="coluna-estimativa"
                        style={{ height: `${(item.estimativa / encontrarMaiorValorComparecimento()) * 200}px` }}
                      >
                        <span className="coluna-valor">{item.estimativa}</span>
                      </div>
                      <span className="coluna-label">Estimativa</span>
                    </div>
                    <div className="coluna-item">
                      <div 
                        className="coluna-realidade"
                        style={{ height: `${(item.realidade / encontrarMaiorValorComparecimento()) * 200}px` }}
                      >
                        <span className="coluna-valor">{item.realidade}</span>
                      </div>
                      <span className="coluna-label">Realidade</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grafico-card lista-card">
            <h3>Lista de inscritos para confirmação</h3>
            <button className="exportar-excel-btn" onClick={exportarParaExcel}>
              📊 Exportar para Excel
            </button>
            <div className="tabela-inscritos">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tipo de Ingresso</th>
                    <th>Confirmação de Pagamento</th>
                    <th>Presença</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosExibidos.inscritos && dadosExibidos.inscritos.length > 0 ? (
                    dadosExibidos.inscritos.map((inscrito, index) => (
                      <tr key={index}>
                        <td>{inscrito.nome}</td>
                        <td>{inscrito.tipoIngresso}</td>
                        <td className={inscrito.pagamentoConfirmado === 'Sim' ? 'confirmado' : 'nao-confirmado'}>
                          {inscrito.pagamentoConfirmado}
                        </td>
                        <td className={inscrito.presenca === 'Confirmada' ? 'presente' : 'ausente'}>
                          {inscrito.presenca}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="nenhum-dado">Nenhum inscrito encontrado</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dados;