import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                setError('Falha ao buscar os usuários.');
            }
        } catch (err) {
            setError('Erro ao tentar se conectar à API.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Realmente deseja excluir permanentemente este usuário?');
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8080/api/users/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert('Usuário excluído com sucesso');
                    fetchUsers(); // Atualiza a lista
                } else {
                    alert('Falha ao excluir o usuário');
                }
            } catch (error) {
                console.error('Erro:', error);
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/create?id=${id}`);
    };

    const handleDeleteAll = async () => {
        const confirmDeleteAll = window.confirm('Realmente deseja excluir permanentemente todos os usuários?');
        if (confirmDeleteAll) {
            try {
                const deletePromises = users.map(user =>
                    fetch(`http://localhost:8080/api/users/${user.id}`, { method: 'DELETE' })
                );
                await Promise.all(deletePromises);
                alert('Todos os usuários foram excluídos com sucesso!');
                fetchUsers(); // Atualiza a lista
            } catch (error) {
                console.error('Erro ao excluir todos os usuários:', error);
                alert('Falha ao excluir todos os usuários.');
            }
        }
    };

    return (
        <div>
            <h2>Lista de Usuários</h2>
            <button onClick={() => navigate('/create')}>Novo</button>
            {loading ? (
                <p>Carregando usuários...</p>
            ) : error ? (
                <p>{error}</p>
            ) : users.length > 0 ? (
                <div>
                    <ul>
                        {users.map((user) => (
                            <li key={user.id}>
                                <strong>ID:</strong> {user.id} <br />
                                <strong>Nome de Usuário:</strong> {user.username} <br />
                                <strong>Email:</strong> {user.email} <br />
                                <button onClick={() => handleEdit(user.id)}>Alterar</button>
                                <button onClick={() => handleDelete(user.id)}>Excluir</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleDeleteAll}>Excluir Todos</button>
                </div>
            ) : (
                <p>Nenhum usuário encontrado.</p>
            )}
        </div>
    );
};

export default UserList;
