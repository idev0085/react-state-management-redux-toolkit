import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateItem, clearSelectedItem, clearError } from '../slices/itemsSlice';
import './ItemEditForm.css';

const ItemEditForm = ({ item, onCancel, onItemUpdated }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.items);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (item) {
            setTitle(item.title);
            setDescription(item.description || '');
        }
    }, [item]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Title is required');
            return;
        }

        const result = await dispatch(
            updateItem({ id: item.id, itemData: { title, description } })
        );
        if (result.type === updateItem.fulfilled.type) {
            handleCancel();
            if (onItemUpdated) onItemUpdated();
        }
    };

    const handleCancel = () => {
        dispatch(clearSelectedItem());
        setTitle('');
        setDescription('');
        if (onCancel) onCancel();
    };

    if (!item) return null;

    return (
        <div className="item-edit-form">
            <h2>Edit Item</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="edit-title">Title:</label>
                    <input
                        id="edit-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter item title"
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="edit-description">Description:</label>
                    <textarea
                        id="edit-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter item description"
                        disabled={loading}
                        rows="3"
                    />
                </div>
                <div className="button-group">
                    <button type="submit" disabled={loading} className="btn-save">
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="btn-cancel"
                    >
                        Cancel
                    </button>
                </div>
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

export default ItemEditForm;
