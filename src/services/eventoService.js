import api from './api';

export const buscarEventos = async () => {
    try {
        const response = await api.get('/eventos');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        throw error;
    }
};

export const buscarEventoPorId = async (id) => {
    try {
        const response = await api.get(`/eventos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar evento:', error);
        throw error;
    }
};

export const buscarIngressosPorEvento = async (eventoId) => {
    try {
        const response = await api.get(`/eventos/${eventoId}/ingressos`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar ingressos:', error);
        throw error;
    }
};

export const criarEvento = async (eventoData) => {
    try {
        const response = await api.post('/eventos', eventoData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar evento:', error);
        throw error;
    }
};

export const atualizarEvento = async (id, eventoData) => {
    try {
        const response = await api.put(`/eventos/${id}`, eventoData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar evento:', error);
        throw error;
    }
};

export const deletarEvento = async (id) => {
    try {
        const response = await api.delete(`/eventos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar evento:', error);
        throw error;
    }
};