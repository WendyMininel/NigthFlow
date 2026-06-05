import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './CriarEvento.css';

const CriarEvento = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('basicas');
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    nomeEvento: '',
    descricao: '',
    artistaPrincipal: '',
    imagemCapa: null,
    imagemCapaBase64: '',
    generoMusical: [],
    data: '',
    horarioInicio: '',
    horarioFim: '',
    nomeLugar: '',
    endereco: '',
    tiposIngressos: [],
    possuiMeiaEntrada: 'nao',
    tipoMeiaEntrada: 'automatico',
    valorMeiaEntrada: '',
    possuiMapa: 'nao',
    mapaImagem: null,
    mapaImagemBase64: '',
    lotes: [],
    classificacaoIndicativa: 'nao',
    idadeMinima: '',
    lineUp: ''
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [currentLote, setCurrentLote] = useState({
    tipoIngresso: '',
    lote: '',
    quantidade: '',
    preco: ''
  });
  const [rascunhoId, setRascunhoId] = useState(null);

  const generosDisponiveis = [
    'Eletrônica', 'Rap/Trap', 'Funk', 'Pop', 'Kpop', 'Rock', 'Sertanejo', 'Pagode', 'Outros'
  ];

  const tiposIngressoDisponiveis = ['VIP', 'Pista', 'Pista premium', 'Arquibancada', 'Outro'];

  // Carregar rascunho se existir
  useEffect(() => {
    const rascunhoSalvo = localStorage.getItem('rascunhoAtual');
    if (rascunhoSalvo) {
      const rascunho = JSON.parse(rascunhoSalvo);
      setRascunhoId(rascunho.id);
      
      let dataFormatada = '';
      if (rascunho.data) {
        const dataObj = new Date(rascunho.data);
        dataFormatada = dataObj.toISOString().split('T')[0];
      }
      
      setEventData({
        nomeEvento: rascunho.nomeEvento || '',
        descricao: rascunho.descricao || '',
        artistaPrincipal: rascunho.artistaPrincipal || '',
        imagemCapa: null,
        imagemCapaBase64: rascunho.imagemCapaBase64 || '',
        generoMusical: rascunho.generoMusical || [],
        data: dataFormatada,
        horarioInicio: rascunho.horarioInicio || '',
        horarioFim: rascunho.horarioFim || '',
        nomeLugar: rascunho.nomeLugar || '',
        endereco: rascunho.endereco || '',
        tiposIngressos: rascunho.tiposIngressos || [],
        possuiMeiaEntrada: rascunho.possuiMeiaEntrada || 'nao',
        tipoMeiaEntrada: rascunho.tipoMeiaEntrada || 'automatico',
        valorMeiaEntrada: rascunho.valorMeiaEntrada || '',
        possuiMapa: rascunho.possuiMapa || 'nao',
        mapaImagem: null,
        mapaImagemBase64: rascunho.mapaImagemBase64 || '',
        lotes: rascunho.lotes || [],
        classificacaoIndicativa: rascunho.classificacaoIndicativa || 'nao',
        idadeMinima: rascunho.idadeMinima || '',
        lineUp: rascunho.lineUp || ''
      });
      
      localStorage.removeItem('rascunhoAtual');
      alert('Rascunho carregado com sucesso!');
    }
  }, []);

  const handleInputChange = (section, field, value) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGeneroChange = (genero) => {
    setEventData(prev => {
      if (prev.generoMusical.includes(genero)) {
        return {
          ...prev,
          generoMusical: prev.generoMusical.filter(g => g !== genero)
        };
      } else {
        return {
          ...prev,
          generoMusical: [...prev.generoMusical, genero]
        };
      }
    });
  };

  const handleTipoIngressoChange = (tipo) => {
    setEventData(prev => {
      if (prev.tiposIngressos.includes(tipo)) {
        return {
          ...prev,
          tiposIngressos: prev.tiposIngressos.filter(t => t !== tipo)
        };
      } else {
        return {
          ...prev,
          tiposIngressos: [...prev.tiposIngressos, tipo]
        };
      }
    });
  };

  const handleAddLote = () => {
    if (currentLote.tipoIngresso && currentLote.lote && currentLote.quantidade && currentLote.preco) {
      setEventData(prev => ({
        ...prev,
        lotes: [...prev.lotes, { ...currentLote }]
      }));
      setCurrentLote({
        tipoIngresso: '',
        lote: '',
        quantidade: '',
        preco: ''
      });
    }
  };

  const handleRemoveLote = (index) => {
    setEventData(prev => ({
      ...prev,
      lotes: prev.lotes.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (field, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setEventData(prev => ({
        ...prev,
        [field]: file,
        [`${field}Base64`]: reader.result
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const formatarDataPreview = (data) => {
    if (!data) return 'Data a definir';
    const dataObj = new Date(data);
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    const diaSemana = diasSemana[dataObj.getDay()];
    const dia = dataObj.getDate();
    const mes = meses[dataObj.getMonth()];
    
    return `${diaSemana}, ${dia} ${mes}`;
  };

  const handleSaveDraft = () => {
    const rascunhos = JSON.parse(localStorage.getItem('rascunhosEventos') || '[]');
    
    const novoRascunho = {
      id: rascunhoId || Date.now(),
      nomeEvento: eventData.nomeEvento,
      descricao: eventData.descricao,
      artistaPrincipal: eventData.artistaPrincipal,
      imagemCapaBase64: eventData.imagemCapaBase64,
      generoMusical: eventData.generoMusical,
      data: eventData.data,
      horarioInicio: eventData.horarioInicio,
      horarioFim: eventData.horarioFim,
      nomeLugar: eventData.nomeLugar,
      endereco: eventData.endereco,
      tiposIngressos: eventData.tiposIngressos,
      lotes: eventData.lotes,
      classificacaoIndicativa: eventData.classificacaoIndicativa,
      idadeMinima: eventData.idadeMinima,
      lineUp: eventData.lineUp,
      dataSalvo: new Date().toISOString(),
      progresso: calcularProgresso()
    };
    
    const rascunhosFiltrados = rascunhos.filter(r => r.id !== novoRascunho.id);
    rascunhosFiltrados.push(novoRascunho);
    
    localStorage.setItem('rascunhosEventos', JSON.stringify(rascunhosFiltrados));
    setRascunhoId(novoRascunho.id);
    alert('Rascunho salvo com sucesso!');
  };

  const calcularProgresso = () => {
    let preenchidos = 0;
    let total = 0;
    
    if (eventData.nomeEvento) preenchidos++;
    total++;
    if (eventData.descricao) preenchidos++;
    total++;
    if (eventData.artistaPrincipal) preenchidos++;
    total++;
    if (eventData.data) preenchidos++;
    total++;
    if (eventData.nomeLugar) preenchidos++;
    total++;
    if (eventData.lotes.length > 0) preenchidos++;
    total++;
    
    return total > 0 ? Math.round((preenchidos / total) * 100) : 0;
  };

  const handlePostEvent = async () => {
    // Validações
    if (!eventData.nomeEvento.trim()) {
      alert('Por favor, preencha o nome do evento');
      return;
    }
    if (!eventData.data) {
      alert('Por favor, preencha a data do evento');
      return;
    }
    if (!eventData.nomeLugar.trim()) {
      alert('Por favor, preencha o local do evento');
      return;
    }

    setLoading(true);

    try {
      console.log('Verificando conexão com o backend...');
      await api.get('/eventos');
      console.log('Backend acessível!');

      const eventoData = {
        usuario_id: 2,
        nome: eventData.nomeEvento,
        descricao: eventData.descricao || '',
        artista: eventData.artistaPrincipal || '',
        data: eventData.data,
        horario: eventData.horarioInicio || '20:00:00',
        local: eventData.nomeLugar,
        endereco: eventData.endereco || '',
        imagem_url: eventData.imagemCapaBase64 || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
        categoria: eventData.generoMusical.length > 0 ? eventData.generoMusical[0] : 'outros'
      };

      console.log('Enviando evento:', eventoData);

      const response = await api.post('/eventos', eventoData);
      console.log('Resposta do servidor:', response.data);
      
      const eventoId = response.data.id;

      if (eventData.lotes.length > 0) {
        for (const lote of eventData.lotes) {
          try {
            await api.post('/ingressos', {
              evento_id: eventoId,
              tipo: lote.tipoIngresso,
              lote: lote.lote,
              preco: parseFloat(lote.preco),
              quantidade_total: parseInt(lote.quantidade),
              quantidade_vendida: 0
            });
          } catch (loteError) {
            console.error('Erro ao criar ingresso:', loteError);
          }
        }
      }

      if (rascunhoId) {
        const rascunhos = JSON.parse(localStorage.getItem('rascunhosEventos') || '[]');
        const rascunhosFiltrados = rascunhos.filter(r => r.id !== rascunhoId);
        localStorage.setItem('rascunhosEventos', JSON.stringify(rascunhosFiltrados));
      }

      alert('Evento publicado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('ERRO DETALHADO:', error);
      
      if (error.response) {
        console.error('Resposta do servidor:', error.response.data);
        console.error('Status:', error.response.status);
        alert(`Erro ${error.response.status}: ${error.response.data?.error || error.response.data?.message || 'Erro ao criar evento'}`);
      } else if (error.request) {
        console.error('Sem resposta do servidor:', error.request);
        alert('Erro: Servidor backend não está rodando. Execute "node server.js" em outro terminal.');
      } else {
        console.error('Erro na requisição:', error.message);
        alert(`Erro: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'basicas', title: 'Informações básicas', color: 'purple', icon: '📝' },
    { id: 'data-local', title: 'Data e local', color: 'blue', icon: '📅' },
    { id: 'ingressos', title: 'Ingressos e lotes', color: 'pink', icon: '🎟️' },
    { id: 'outros', title: 'Outros detalhes', color: 'white', icon: '✨' }
  ];

  const menorPreco = eventData.lotes.length > 0 
    ? Math.min(...eventData.lotes.map(l => parseFloat(l.preco))) 
    : 0;

  return (
    <div className="criar-evento-page">
      <div className="criar-evento-header">
        <Link to="/" className="back-home-btn">⮜</Link>
        <h1>Criar Evento</h1>
      </div>

      <div className="sections-container">
        {sections.map(section => (
          <div 
            key={section.id}
            className={`section-card section-${section.color} ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <div className="section-header">
              <span className="section-icon">{section.icon}</span>
              <h3>{section.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="form-container">
        {activeSection === 'basicas' && (
          <div className="form-section basics-section">
            <h2>Informações Básicas</h2>
            
            <div className="form-group">
              <label>Nome do evento *</label>
              <input 
                type="text" 
                placeholder="Ex: Ultra Music Festival 2024"
                value={eventData.nomeEvento}
                onChange={(e) => handleInputChange('basicas', 'nomeEvento', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea 
                rows="4"
                placeholder="Descreva o evento..."
                value={eventData.descricao}
                onChange={(e) => handleInputChange('basicas', 'descricao', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Artista/Atração principal</label>
              <input 
                type="text" 
                placeholder="Ex: DJ Alok, Anitta, etc."
                value={eventData.artistaPrincipal}
                onChange={(e) => handleInputChange('basicas', 'artistaPrincipal', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Imagem de capa</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload('imagemCapa', e.target.files[0])}
              />
              {eventData.imagemCapaBase64 && (
                <img src={eventData.imagemCapaBase64} alt="Preview" className="image-preview" />
              )}
            </div>

            <div className="form-group">
              <label>Gênero musical</label>
              <div className="generos-grid">
                {generosDisponiveis.map(genero => (
                  <button
                    key={genero}
                    className={`genero-btn ${eventData.generoMusical.includes(genero) ? 'selected' : ''}`}
                    onClick={() => handleGeneroChange(genero)}
                    type="button"
                  >
                    {genero}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'data-local' && (
          <div className="form-section data-local-section">
            <h2>Data e Local</h2>

            <div className="form-group">
              <label>Data *</label>
              <input 
                type="date"
                value={eventData.data}
                onChange={(e) => handleInputChange('data-local', 'data', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Horário início</label>
                <input 
                  type="time"
                  value={eventData.horarioInicio}
                  onChange={(e) => handleInputChange('data-local', 'horarioInicio', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Horário fim</label>
                <input 
                  type="time"
                  value={eventData.horarioFim}
                  onChange={(e) => handleInputChange('data-local', 'horarioFim', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nome do lugar *</label>
              <input 
                type="text"
                placeholder="Ex: Allianz Parque, Audio Club, etc."
                value={eventData.nomeLugar}
                onChange={(e) => handleInputChange('data-local', 'nomeLugar', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Endereço</label>
              <input 
                type="text"
                placeholder="Rua, número, bairro, cidade, CEP"
                value={eventData.endereco}
                onChange={(e) => handleInputChange('data-local', 'endereco', e.target.value)}
              />
            </div>
          </div>
        )}

        {activeSection === 'ingressos' && (
          <div className="form-section ingressos-section">
            <h2>Ingressos e Lotes</h2>

            <div className="form-group">
              <label>Tipos de ingressos</label>
              <div className="tipos-grid">
                {tiposIngressoDisponiveis.map(tipo => (
                  <button
                    key={tipo}
                    className={`tipo-btn ${eventData.tiposIngressos.includes(tipo) ? 'selected' : ''}`}
                    onClick={() => handleTipoIngressoChange(tipo)}
                    type="button"
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Adicionar lotes</label>
              <div className="lote-form">
                <select 
                  value={currentLote.tipoIngresso}
                  onChange={(e) => setCurrentLote({...currentLote, tipoIngresso: e.target.value})}
                >
                  <option value="">Selecione o tipo</option>
                  {eventData.tiposIngressos.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                
                <input 
                  type="text"
                  placeholder="Lote (Ex: Lote 1)"
                  value={currentLote.lote}
                  onChange={(e) => setCurrentLote({...currentLote, lote: e.target.value})}
                />
                
                <input 
                  type="number"
                  placeholder="Quantidade"
                  value={currentLote.quantidade}
                  onChange={(e) => setCurrentLote({...currentLote, quantidade: e.target.value})}
                />
                
                <input 
                  type="number"
                  placeholder="Preço (R$)"
                  value={currentLote.preco}
                  onChange={(e) => setCurrentLote({...currentLote, preco: e.target.value})}
                />
                
                <button type="button" onClick={handleAddLote} className="add-lote-btn">
                  Adicionar Lote
                </button>
              </div>
            </div>

            {eventData.lotes.length > 0 && (
              <div className="lotes-list">
                <h3>Lotes adicionados:</h3>
                {eventData.lotes.map((lote, index) => (
                  <div key={index} className="lote-item">
                    <span>{lote.tipoIngresso} - {lote.lote}</span>
                    <span>{lote.quantidade} ingressos</span>
                    <span>R$ {lote.preco}</span>
                    <button onClick={() => handleRemoveLote(index)} className="remove-btn">❌</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'outros' && (
          <div className="form-section outros-section">
            <h2>Outros Detalhes</h2>

            <div className="form-group">
              <label>Classificação indicativa?</label>
              <div className="radio-group">
                <label>
                  <input 
                    type="radio" 
                    value="nao"
                    checked={eventData.classificacaoIndicativa === 'nao'}
                    onChange={() => handleInputChange('outros', 'classificacaoIndicativa', 'nao')}
                  />
                  Não
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="sim"
                    checked={eventData.classificacaoIndicativa === 'sim'}
                    onChange={() => handleInputChange('outros', 'classificacaoIndicativa', 'sim')}
                  />
                  Sim, ___ anos
                </label>
              </div>
            </div>

            {eventData.classificacaoIndicativa === 'sim' && (
              <div className="form-group">
                <label>Idade mínima</label>
                <input 
                  type="number"
                  placeholder="Ex: 18"
                  value={eventData.idadeMinima}
                  onChange={(e) => handleInputChange('outros', 'idadeMinima', e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label>Horário / Line up</label>
              <textarea 
                rows="6"
                placeholder="Descreva a ordem de apresentação..."
                value={eventData.lineUp}
                onChange={(e) => handleInputChange('outros', 'lineUp', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="preview-section">
        <button className="preview-btn" onClick={() => setPreviewMode(!previewMode)}>
          👁️ {previewMode ? 'Esconder' : 'Mostrar'} Pré-visualização
        </button>
        
        {previewMode && (
          <div className="preview-card-completo">
            <div className="preview-card-evento">
              <div className="preview-imagem-container">
                {eventData.imagemCapaBase64 ? (
                  <img src={eventData.imagemCapaBase64} alt={eventData.nomeEvento} className="preview-imagem" />
                ) : (
                  <div className="preview-sem-imagem">Sem imagem</div>
                )}
              </div>
              <div className="preview-info-container">
                <h3 className="preview-nome">{eventData.nomeEvento || 'Nome do evento'}</h3>
                <div className="preview-detalhes">
                  <div className="preview-left">
                    <p className="preview-data">{formatarDataPreview(eventData.data)}</p>
                    <p className="preview-local">{eventData.nomeLugar || 'Local a definir'}</p>
                    <p className="preview-preco">R$ {menorPreco}+</p>
                  </div>
                  <div className="preview-right">
                    <button className="preview-saiba-mais">Saiba mais</button>
                    <button className="preview-carrinho">🛒</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button className="post-btn" onClick={handlePostEvent} disabled={loading}>
          {loading ? 'Publicando...' : '📢 Postar evento'}
        </button>
        <button className="draft-btn" onClick={handleSaveDraft}>
          💾 Salvar como rascunho
        </button>
      </div>
    </div>
  );
};

export default CriarEvento;