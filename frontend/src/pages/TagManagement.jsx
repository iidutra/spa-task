import React, { useState, useEffect } from 'react';
import { createTag, updateTag, deleteTag, request } from '../services/api';
import NavBar from './NavBar'; // Ajuste o caminho conforme necessário
import '../styles/Style.css';
import '../styles/Tag.css';

function TagManagement() {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [editTagId, setEditTagId] = useState(null);
    const [editTagName, setEditTagName] = useState('');

    // Carregar tags ao montar e quando editTagId muda
    useEffect(() => {
        fetchTags();
    }, [editTagId]);

    // Buscar todas as tags
    const fetchTags = async () => {
        try {
            const tagsResponse = await request('/tags');
            setTags(tagsResponse);
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : error.message;
            console.error('Erro ao adicionar tag:', errorMessage);
            alert('Erro ao adicionar tag: ' + errorMessage);
        }

    };

    const handleAddTag = async () => {
        if (newTag.trim()) {
            try {
                const createdTag = await createTag(newTag);
                setTags([...tags, createdTag]);
                setNewTag('');
            } catch (error) {
                console.error('Erro ao criar tag:', error);
                alert(`Erro ao criar tag: ${newTag}`);
            }

        };
    };

    const handleEditTag = async () => {
        if (editTagName.trim() && editTagId) {
            try {
                const updatedTag = await updateTag(`/tags/${editTagId}`, { name: editTagName });
                setTags(tags.map(tag => (tag._id === editTagId ? updatedTag : tag)));
                setEditTagId(null);
                setEditTagName('');
            } catch (error) {
                console.error('Erro ao atualizar tag:', error);
            }
        }
    };

    const handleDeleteTag = async (id) => {
        try {
            await deleteTag(`/tags/${id}`);
            setTags(tags.filter(tag => tag._id !== id));
        } catch (error) {
            console.error('Erro ao deletar tag:', error);
        }
    };

    const startEditing = (tag) => {
        setEditTagId(tag._id);
        setEditTagName(tag.name);
    };

    const stopEditing = () => {
        setEditTagId(null);
        setEditTagName('');
    };


    // Renderiza o formulário de tag e a lista de tags
    return (
        <>
            <NavBar />
            <div className="body-tag-bg">
                <div className="tag-management ">
                    <div className="tag-management-header">
                        <h2>Gerenciar Tags</h2>
                        <div className="tag-add-form">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Adicione uma nova tag"
                            />
                            <button onClick={handleAddTag}>Adicionar Tag</button>
                        </div>
                    </div>
                    <table className="tag-table">
                        <thead>
                            <tr>
                                <th>Tag</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tags.map(tag => (
                                <tr key={tag._id}>
                                    <td>
                                        {editTagId === tag._id ? (
                                            <input
                                                type="text"
                                                value={editTagName}
                                                onChange={(e) => setEditTagName(e.target.value)}
                                            />
                                        ) : (
                                            <h3>{tag.name}</h3>
                                        )}
                                    </td>
                                    <td>
                                        {editTagId === tag._id ? (
                                            <>
                                                <button className='' onClick={handleEditTag}>Salvar</button>
                                                <button onClick={stopEditing}>Cancelar</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="button-secondary" onClick={() => startEditing(tag)}>Editar</button>
                                                <button className="button-primary" onClick={() => handleDeleteTag(tag._id)}>Deletar</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default TagManagement;
