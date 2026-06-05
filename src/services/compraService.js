import api from './api';

export const realizarCompra = async (compraData) => {
    try {
        const response = await api.post('/compras', compraData);
        return response.data;
    } catch (error) {
        console.error('Erro ao realizar compra:', error);
        throw error;
    }
};