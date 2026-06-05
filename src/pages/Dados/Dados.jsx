import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Dados.css';

const Dados = () => {
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dadosEventos, setDadosEventos] = useState({});

  useEffect(() => {
    const carregarEventos = async () => {
      try {
        const response = await api.get('/eventos');
        setEventos(response.data);
        
        const eventosComDados = {};
        
        for (const evento of response.data) {
          const ingressosResponse = await api.get(`/eventos/${evento.id}/ingressos`);
          const ingressos = ingressosResponse.data;
          
          const totalIngressos = ingressos.reduce((sum, i) => sum + i.quantidade_total, 0);
          const totalVendidos = ingressos.reduce((sum, i) => sum + i.quantidade_vendida, 0);
          
          const lotes = ingressos.map(ingresso => ({
            nome: ingresso.lote,
            vendidos: ingresso.quantidade_vendida,
            total: ingresso.quantidade_total,
            tipo: ingresso.tipo
          }));
          
          const pagamentos = {
            pix: Math.floor(Math.random() * 50) + 30,
            boleto: Math.floor(Math.random() * 30) + 10,
            credito: Math.floor(Math.random() * 30) + 20,
            debito: Math.floor(Math.random() * 20) + 5
          };
          
          const totalPagamentos = pagamentos.pix + pagamentos.boleto + pagamentos.credito + pagamentos.debito;
          pagamentos.pix = Math.round((pagamentos.pix / totalPagamentos) * 100);
          pagamentos.boleto = Math.round((pagamentos.boleto / totalPagamentos) * 100);
          pagamentos.credito = Math.round((pagamentos.credito / totalPagamentos) * 100);
          pagamentos.debito = 100 - (pagamentos.pix + pagamentos.boleto + pagamentos.credito);
          
          const comparecimento = ingressos.map(ingresso => {
            const estimativa = ingresso.quantidade_total;
            const realidade = ingresso.quantidade_vendida;
            return {
              tipo: ingresso.tipo,
              estimativa: estimativa,
              realidade: realidade
            };
          });
          
          const nomes = ['Joao Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Souza', 'Fernanda Lima', 'Lucas Ferreira', 'Beatriz Rodrigues', 'Rafael Alves', 'Camila Nunes'];
          
          const inscritos = [];
          for (let i = 0; i < Math.min(ingressos.length * 2, 10); i++) {
            const ingresso = ingressos[i % ingressos.length];
            inscritos.push({
              nome: nomes[i % nomes.length],
              tipoIngresso: ingresso.tipo,
              pagamentoConfirmado: Math.random() > 0.3 ? 'Sim' : 'Nao',
              presenca: Math.random() > 0.4 ? 'Confirmada' : 'Pendente'
            });
          }
          
          eventosComDados[evento.id] = {
            lotes,
            pagamentos,
            comparecimento,
            inscritos,
            totalIngressos,
            totalVendidos,
            taxaOcupacao: totalIngressos > 0 ? Math.round((totalVendidos / totalIngressos) * 100) : 0
          };
        }
        
        setDadosEventos(eventosComDados);
        
        const eventoIdSalvo = localStorage.getItem('eventoSelecionadoId');
        if (eventoIdSalvo) {
          const eventoEncontrado = response.data.find(e => e.id === parseInt(eventoIdSalvo));
          if (eventoEncontrado) {
            setEventoSelecionado(eventoEncontrado);
          }
          localStorage.removeItem('eventoSelecionadoId');
        }
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarEventos();
  }, []);

  const calcularEstatisticasGerais = () => {
    if (!eventos.length || Object.keys(dadosEventos).length === 0) return null;
    
    let totalIngressos = 0;
    let totalVendidos = 0;
    let lotesConsolidados = [];
    let pagamentosConsolidados = { pix: 0, boleto: 0, credito: 0, debito: 0 };
    let comparecimentoConsolidado = [];
    let inscritosConsolidados = [];
    
    eventos.forEach(evento => {
      const dados = dadosEventos[evento.id];
      if (dados) {
        totalIngressos += dados.totalIngressos;
        totalVendidos += dados.totalVendidos;
        
        dados.lotes.forEach(lote => {
          const loteExistente = lotesConsolidados.find(l => l.nome === lote.nome && l.tipo === lote.tipo);
          if (loteExistente) {
            loteExistente.vendidos += lote.vendidos;
            loteExistente.total += lote.total;
          } else {
            lotesConsolidados.push({ ...lote });
          }
        });
        
        pagamentosConsolidados.pix += dados.pagamentos.pix;
        pagamentosConsolidados.boleto += dados.pagamentos.boleto;
        pagamentosConsolidados.credito += dados.pagamentos.credito;
        pagamentosConsolidados.debito += dados.pagamentos.debito;
        
        dados.comparecimento.forEach(item => {
          const itemExistente = comparecimentoConsolidado.find(c => c.tipo === item.tipo);
          if (itemExistente) {
            itemExistente.estimativa += item.estimativa;
            itemExistente.realidade += item.realidade;
          } else {
            comparecimentoConsolidado.push({ ...item });
          }
        });
        
        inscritosConsolidados.push(...dados.inscritos);
      }
    });
    
    const totalPagamentos = pagamentosConsolidados.pix + pagamentosConsolidados.boleto + 
                           pagamentosConsolidados.credito + pagamentosConsolidados.debito;
    
    if (totalPagamentos > 0) {
      pagamentosConsolidados.pix = Math.round((pagamentosConsolidados.pix / totalPagamentos) * 100);
      pagamentosConsolidados.boleto = Math.round((pagamentosConsolidados.boleto / totalPagamentos) * 100);
      pagamentosConsolidados.credito = Math.round((pagamentosConsolidados.credito / totalPagamentos) * 100);
      pagamentosConsolidados.debito = 100 - (pagamentosConsolidados.pix + pagamentosConsolidados.boleto + pagamentosConsolidados.credito);
    }
    
    return {
      lotes: lotesConsolidados,
      pagamentos: pagamentosConsolidados,
      comparecimento: comparecimentoConsolidado,
      inscritos: inscritosConsolidados.slice(0, 15),
      totalIngressos,
      totalVendidos,
      taxaOcupacao: totalIngressos > 0 ? Math.round((totalVendidos / totalIngressos) * 100) : 0
    };
  };

  const dadosExibidos = eventoSelecionado 
    ? dadosEventos[eventoSelecionado.id] 
    : calcularEstatisticasGerais();

  const exportarParaExcel = () => {
    const dadosExportacao = dadosExibidos?.inscritos || [];
    
    const cabecalho = ["Nome", "Tipo de Ingresso", "Confirmacao de Pagamento", "Presenca"];
    
    const linhas = dadosExportacao.map(item => [
      item.nome,
      item.tipoIngresso,
      item.pagamentoConfirmado,
      item.presenca
    ]);
    
    const conteudoCSV = [cabecalho, ...linhas].map(row => row.join(",")).join("\n");
    
    const blob = new Blob(["\uFEFF" + conteudoCSV], { type: "text/csv;charset=utf-8;" });
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

  if (loading) {
    return (
      <div className="dados-page">
        <div className="page-header">
          <Link to="/" className="back-arrow">⮜</Link>
          <h1>Dados e Estatisticas</h1>
        </div>
        <div className="loading-container">Carregando dados...</div>
      </div>
    );
  }

  return (
    <div className="dados-page">
      <div className="page-header">
        <Link to="/" className="back-arrow">⮜</Link>
        <h1>Dados e Estatisticas</h1>
      </div>

      <div className="eventos-selector">
        <h2>Selecione um evento</h2>
        <div className="eventos-buttons">
          <button 
            className={`evento-select-btn ${eventoSelecionado === null ? 'active' : ''}`}
            onClick={() => setEventoSelecionado(null)}
          >
            Todos os Eventos
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
                  <div className="linha-label">{lote.nome} ({lote.tipo})</div>
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
                  <span>PIX: {dadosExibidos.pagamentos?.pix}%</span>
                </div>
                <div className="pagamento-item">
                  <div className="pagamento-cor boleto"></div>
                  <span>Boleto: {dadosExibidos.pagamentos?.boleto}%</span>
                </div>
                <div className="pagamento-item">
                  <div className="pagamento-cor credito"></div>
                  <span>Credito: {dadosExibidos.pagamentos?.credito}%</span>
                </div>
                <div className="pagamento-item">
                  <div className="pagamento-cor debito"></div>
                  <span>Debito: {dadosExibidos.pagamentos?.debito}%</span>
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
            <h3>Comparecimento por tipo de ingresso</h3>
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
            <h3>Lista de inscritos para confirmacao</h3>
            <button className="exportar-excel-btn" onClick={exportarParaExcel}>
              Exportar para Excel
            </button>
            <div className="tabela-inscritos">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tipo de Ingresso</th>
                    <th>Confirmacao de Pagamento</th>
                    <th>Presenca</th>
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