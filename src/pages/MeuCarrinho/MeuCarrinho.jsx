import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import './MeuCarrinho.css';

const MeuCarrinho = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, finalizarCompra } = useCart();
  const [cupom, setCupom] = useState('');
  const [desconto, setDesconto] = useState(0);

  const formatarPreco = (preco) => {
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const calcularSubtotal = () => {
    return getCartTotal();
  };

  const calcularTaxaServico = () => {
    const subtotal = calcularSubtotal();
    return subtotal * 0.10;
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const taxa = calcularTaxaServico();
    return subtotal + taxa - desconto;
  };

  const aplicarCupom = () => {
    if (cupom.toUpperCase() === 'NIGHT10') {
      const subtotal = calcularSubtotal();
      setDesconto(subtotal * 0.10);
    } else if (cupom.toUpperCase() === 'FLOW20') {
      const subtotal = calcularSubtotal();
      setDesconto(subtotal * 0.20);
    } else if (cupom === '') {
      setDesconto(0);
    } else {
      alert('Cupom inválido!');
    }
  };

  const handleFinalizarCompra = () => {
    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    
    const ingressosComprados = finalizarCompra();
    alert(`Compra finalizada com sucesso! Total: ${formatarPreco(calcularTotal())}\n${ingressosComprados.length} ingresso(s) adicionado(s) aos seus ingressos.`);
    navigate('/meus-ingressos');
  };

  const subtotal = calcularSubtotal();
  const taxaServico = calcularTaxaServico();
  const total = calcularTotal();

  return (
    <div className="carrinho-page">
      <div className="page-header">
        <Link to="/" className="back-arrow">⮜</Link>
        <h1>Carrinho de compras</h1>
      </div>

      <div className="carrinho-container">
        <div className="itens-container">
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <div key={item.id} className="item-card">
                <div className="item-imagem">
                  <img src={item.imagem} alt={item.artista} />
                </div>
                
                <div className="item-info">
                  <h3 className="item-artista">{item.artista}</h3>
                  <p className="item-data">{item.data} • {item.horario}h</p>
                  <p className="item-local">{item.local}</p>
                  <Link to={`/evento/${item.eventoId}`} className="ver-detalhes">
                    Ver detalhes
                  </Link>
                  <p className="item-tipo">Tipo: {item.tipo} - {item.lote}</p>
                </div>

                <div className="item-controles">
                  <div className="quantidade-selector">
                    <button 
                      className="qtd-btn"
                      onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                    >
                      –
                    </button>
                    <span className="qtd-numero">{item.quantidade}</span>
                    <button 
                      className="qtd-btn"
                      onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="item-preco-total">{formatarPreco(item.preco * item.quantidade)}</p>
                  <button 
                    className="remover-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="carrinho-vazio">
              <p>Seu carrinho está vazio</p>
              <Link to="/" className="continuar-comprando">Continuar comprando</Link>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="resumo-container">
            <h2>Resumo do pedido</h2>
            
            <div className="resumo-linha">
              <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantidade, 0)} ingresso{cartItems.reduce((acc, item) => acc + item.quantidade, 0) !== 1 ? 's' : ''})</span>
              <span>{formatarPreco(subtotal)}</span>
            </div>

            <div className="resumo-linha">
              <span>Taxa de serviço (10%)</span>
              <span>{formatarPreco(taxaServico)}</span>
            </div>

            {desconto > 0 && (
              <div className="resumo-linha desconto">
                <span>Desconto</span>
                <span>- {formatarPreco(desconto)}</span>
              </div>
            )}

            <div className="resumo-cupom">
              <label>Cupom:</label>
              <div className="cupom-input-group">
                <input 
                  type="text" 
                  className="cupom-input"
                  placeholder="Digite seu cupom"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                />
                <button className="aplicar-cupom-btn" onClick={aplicarCupom}>
                  Aplicar
                </button>
              </div>
              <div className="cupom-exemplos">
                <span>Cupons disponíveis: NIGHT10 (10% off) | FLOW20 (20% off)</span>
              </div>
            </div>

            <div className="resumo-linha total">
              <span>Total:</span>
              <span>{formatarPreco(total)}</span>
            </div>

            <button className="finalizar-compra-btn" onClick={handleFinalizarCompra}>
              Finalizar compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeuCarrinho;