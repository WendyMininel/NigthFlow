import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CriarEvento.css';

const CriarEvento = () => {
  const [activeSection, setActiveSection] = useState('basicas');
  const [eventData, setEventData] = useState({
    // Informações básicas
    nomeEvento: '',
    descricao: '',
    artistaPrincipal: '',
    imagemCapa: null,
    generoMusical: [],
    
    // Data e local
    data: '',
    horarioInicio: '',
    horarioFim: '',
    nomeLugar: '',
    endereco: '',
    
    // Ingressos e lotes
    tiposIngressos: [],
    possuiMeiaEntrada: 'nao',
    tipoMeiaEntrada: 'automatico',
    valorMeiaEntrada: '',
    possuiMapa: 'nao',
    mapaImagem: null,
    lotes: [],
    
    // Outros detalhes
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

  const generosDisponiveis = [
    'Eletrônica', 'Rap/Trap', 'Funk', 'Pop', 'Kpop', 'Rock', 'Sertanejo', 'Pagode', 'Outros'
  ];

  const tiposIngressoDisponiveis = ['VIP', 'Pista', 'Pista premium', 'Arquibancada', 'Outro'];

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
          tiposingressos: prev.tiposIngressos.filter(t => t !== tipo)
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
        lotes: [...prev.lotes, currentLote]
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
        [field]: reader.result
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handlePostEvent = () => {
    console.log('Evento publicado:', eventData);
    alert('Evento publicado com sucesso!');
  };

  const handleSaveDraft = () => {
    console.log('Rascunho salvo:', eventData);
    alert('Rascunho salvo com sucesso!');
  };

  const sections = [
    { id: 'basicas', title: 'Informações básicas', color: 'purple', icon: '📝' },
    { id: 'data-local', title: 'Data e local', color: 'blue', icon: '📅' },
    { id: 'ingressos', title: 'Ingressos e lotes', color: 'pink', icon: '🎟️' },
    { id: 'outros', title: 'Outros detalhes', color: 'white', icon: '✨' }
  ];

  return (
    <div className="criar-evento-page">
      <div className="criar-evento-header">
        <Link to="/" className="back-home-btn">← Voltar para Home</Link>
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
        {/* Seção 1: Informações Básicas */}
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
              <label>Descrição *</label>
              <textarea 
                rows="4"
                placeholder="Descreva o evento..."
                value={eventData.descricao}
                onChange={(e) => handleInputChange('basicas', 'descricao', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Artista/Atração principal *</label>
              <input 
                type="text" 
                placeholder="Ex: DJ Alok, Anitta, etc."
                value={eventData.artistaPrincipal}
                onChange={(e) => handleInputChange('basicas', 'artistaPrincipal', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Imagem de capa *</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload('imagemCapa', e.target.files[0])}
              />
              {eventData.imagemCapa && (
                <img src={eventData.imagemCapa} alt="Preview" className="image-preview" />
              )}
            </div>

            <div className="form-group">
              <label>Gênero musical *</label>
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

        {/* Seção 2: Data e Local */}
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
                <label>Horário início *</label>
                <input 
                  type="time"
                  value={eventData.horarioInicio}
                  onChange={(e) => handleInputChange('data-local', 'horarioInicio', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Horário fim *</label>
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
              <label>Endereço *</label>
              <input 
                type="text"
                placeholder="Rua, número, bairro, cidade, CEP"
                value={eventData.endereco}
                onChange={(e) => handleInputChange('data-local', 'endereco', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Seção 3: Ingressos e lotes */}
        {activeSection === 'ingressos' && (
          <div className="form-section ingressos-section">
            <h2>Ingressos e Lotes</h2>

            <div className="form-group">
              <label>Tipos de ingressos *</label>
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
              <label>Possui meia entrada? *</label>
              <div className="radio-group">
                <label>
                  <input 
                    type="radio" 
                    value="sim"
                    checked={eventData.possuiMeiaEntrada === 'sim'}
                    onChange={() => handleInputChange('ingressos', 'possuiMeiaEntrada', 'sim')}
                  />
                  Sim
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="nao"
                    checked={eventData.possuiMeiaEntrada === 'nao'}
                    onChange={() => handleInputChange('ingressos', 'possuiMeiaEntrada', 'nao')}
                  />
                  Não
                </label>
              </div>
            </div>

            {eventData.possuiMeiaEntrada === 'sim' && (
              <>
                <div className="form-group">
                  <label>Dividir o preço da inteira ou digitar manualmente?</label>
                  <div className="radio-group">
                    <label>
                      <input 
                        type="radio" 
                        value="automatico"
                        checked={eventData.tipoMeiaEntrada === 'automatico'}
                        onChange={() => handleInputChange('ingressos', 'tipoMeiaEntrada', 'automatico')}
                      />
                      Dividir automaticamente (50%)
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        value="manual"
                        checked={eventData.tipoMeiaEntrada === 'manual'}
                        onChange={() => handleInputChange('ingressos', 'tipoMeiaEntrada', 'manual')}
                      />
                      Digitar manualmente
                    </label>
                  </div>
                </div>

                {eventData.tipoMeiaEntrada === 'manual' && (
                  <div className="form-group">
                    <label>Valor da meia-entrada (R$)</label>
                    <input 
                      type="number"
                      placeholder="0,00"
                      value={eventData.valorMeiaEntrada}
                      onChange={(e) => handleInputChange('ingressos', 'valorMeiaEntrada', e.target.value)}
                    />
                  </div>
                )}
              </>
            )}

            <div className="form-group">
              <label>Adicionar um mapa ilustrativo?</label>
              <div className="radio-group">
                <label>
                  <input 
                    type="radio" 
                    value="sim"
                    checked={eventData.possuiMapa === 'sim'}
                    onChange={() => handleInputChange('ingressos', 'possuiMapa', 'sim')}
                  />
                  Sim
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="nao"
                    checked={eventData.possuiMapa === 'nao'}
                    onChange={() => handleInputChange('ingressos', 'possuiMapa', 'nao')}
                  />
                  Não
                </label>
              </div>
            </div>

            {eventData.possuiMapa === 'sim' && (
              <div className="form-group">
                <label>Carregar imagem do mapa</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload('mapaImagem', e.target.files[0])}
                />
                {eventData.mapaImagem && (
                  <img src={eventData.mapaImagem} alt="Mapa" className="image-preview" />
                )}
              </div>
            )}

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
                  placeholder="Lote (Ex: Lote 1, Lote Promocional)"
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

        {/* Seção 4: Outros detalhes */}
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
                placeholder="Descreva a ordem de apresentação ou grade de horários...
Ex:
22:00 - Abertura
23:00 - DJ Principal
01:00 - Encerramento"
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
          <div className="preview-card">
            <div className="preview-image-placeholder">
              {eventData.imagemCapa ? (
                <img src={eventData.imagemCapa} alt="Preview" />
              ) : (
                <div className="placeholder">Imagem do evento</div>
              )}
            </div>
            <div className="preview-info">
              <h3>{eventData.nomeEvento || 'Título do evento'}</h3>
              <p className="preview-date">
                {eventData.data ? new Date(eventData.data).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Data a definir'}
              </p>
              <p className="preview-location">{eventData.nomeLugar || 'Local a definir'}</p>
              <button className="preview-saiba-mais">Saiba mais</button>
              <p className="preview-price">
                {eventData.lotes.length > 0 ? `R$ ${Math.min(...eventData.lotes.map(l => parseFloat(l.preco)))}` : 'R$ 0'}+
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="post-btn" onClick={handlePostEvent}>
          Postar evento
        </button>
        <button className="draft-btn" onClick={handleSaveDraft}>
          Salvar como rascunho
        </button>
      </div>
    </div>
  );
};

export default CriarEvento;