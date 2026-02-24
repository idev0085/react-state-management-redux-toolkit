import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createItem, clearError } from '../slices/itemsSlice';
import './ItemForm.css';

const ItemForm = ({ onItemCreated }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.items);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Title is required');
            return;
        }

        const result = await dispatch(createItem({ title, description }));
        if (result.type === createItem.fulfilled.type) {
            setTitle('');
            setDescription('');
            if (onItemCreated) onItemCreated();
        }
    };

    return (
        <div className="item-form">
            <h2>Add New Item</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter item title"
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter item description"
                        disabled={loading}
                        rows="3"
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Add Item'}
                </button>
            </form>
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => dispatch(clearError())}>Dismiss</button>
                </div>
            )}
        </div>
    );
};

export default ItemForm;
