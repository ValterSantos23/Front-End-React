import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CreateUserForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [isEdit, setIsEdit] = useState(false); // Estado para verificar se é edição
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const userId = searchParams.get('id');

    useEffect(() => {
        if (userId) {
            // Se tiver um ID, busca os dados do usuário para editar
            const fetchUser = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/users/${userId}`);
                    if (response.ok) {
                        const user = await response.json();
                        setFormData({ username: user.username, email: user.email, password: '' });
                        setIsEdit(true);
                    }
                } catch (error) {
                    console.error('Erro ao buscar usuário:', error);
                }
            };
            fetchUser();
        }
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isEdit
            ? `http://localhost:8080/api/users/${userId}`
            : 'http://localhost:8080/api/user';

        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(isEdit ? 'Usuário alterado com sucesso!' : 'Usuário criado com sucesso!');
                navigate('/'); // Volta para a lista de usuários
            } else {
                alert('Falha ao salvar o usuário');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    return (
        <div>
            <h2>{isEdit ? 'Editar Usuário' : 'Criar Usuário'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome de Usuário:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                {!isEdit && (
                    <div>
                        <label>Senha:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                <button type="submit">{isEdit ? 'Salvar Alterações' : 'Criar Usuário'}</button>
                <button type="button" onClick={() => navigate('/')}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default CreateUserForm;
