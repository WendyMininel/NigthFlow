import api from './api';

export const criarIngresso = async (ingressoData) => {
    try {
        const response = await api.post('/ingressos', ingressoData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar ingresso:', error);
        throw error;
    }
};