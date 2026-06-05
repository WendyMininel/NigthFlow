import api from './api';

export const buscarUsuarios = async () => {
    try {
        const response = await api.get('/usuarios');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
    }
};

export const criarUsuario = async (usuarioData) => {
    try {
        const response = await api.post('/usuarios', usuarioData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
};

export const atualizarUsuario = async (id, usuarioData) => {
    try {
        const response = await api.put(`/usuarios/${id}`, usuarioData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
};

export const deletarUsuario = async (id) => {
    try {
        const response = await api.delete(`/usuarios/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        throw error;
    }
};