import React, { createContext, useState, useContext } from 'react';
import { realizarCompra } from '../services/compraService';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children, usuarioId }) => {
    const [cartItems, setCartItems] = useState([]);
    const [meusIngressos, setMeusIngressos] = useState([]);

    const addToCart = (item) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                i => i.eventoId === item.eventoId && i.tipo === item.tipo && i.lote === item.lote
            );

            if (existingItemIndex !== -1) {
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantidade += item.quantidade;
                return newItems;
            }

            const newItem = { ...item, id: Date.now() };
            return [...prevItems, newItem];
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(itemId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantidade: newQuantity } : item
            )
        );
    };

    const finalizarCompra = async () => {
        const hoje = new Date();
        const novosIngressos = [];

        for (const item of cartItems) {
            const dataEvento = new Date(item.dataEvento || '2024-12-31');
            const status = dataEvento > hoje ? 'valido' : 'passado';

            // Salvar compra no banco de dados
            try {
                const compraData = {
                    usuario_id: usuarioId || 1,
                    ingresso_id: item.ingressoId || 1,
                    quantidade: item.quantidade,
                    preco_unitario: item.preco,
                    preco_total: item.preco * item.quantidade
                };

                const result = await realizarCompra(compraData);

                const ingresso = {
                    id: Date.now() + Math.random(),
                    eventoId: item.eventoId,
                    artista: item.artista,
                    data: item.data,
                    dataEvento: item.dataEvento,
                    horario: item.horario,
                    local: item.local,
                    tipoIngresso: item.tipo,
                    lote: item.lote,
                    quantidade: item.quantidade,
                    precoUnitario: item.preco,
                    precoTotal: item.preco * item.quantidade,
                    status: status,
                    imagem: item.imagem,
                    qrCode: result.qr_code || `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Ingresso${item.eventoId}${Date.now()}`,
                    codigoIngresso: `${item.eventoId}-${item.tipo.toUpperCase()}-${Date.now()}`
                };
                novosIngressos.push(ingresso);
            } catch (error) {
                console.error('Erro ao finalizar compra:', error);
            }
        }

        setMeusIngressos(prev => [...prev, ...novosIngressos]);
        setCartItems([]);
        return novosIngressos;
    };

    const removerIngresso = (ingressoId) => {
        setMeusIngressos(prev => prev.filter(ingresso => ingresso.id !== ingressoId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantidade, 0);
    };

    const value = {
        cartItems,
        meusIngressos,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        finalizarCompra,
        removerIngresso,
        getCartTotal,
        getCartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};