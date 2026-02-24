import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, fetchItemById, clearSelectedItem, clearError } from '../slices/itemsSlice';
import './ItemList.css';

const ItemList = ({ items, onEditClick }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.items);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            await dispatch(deleteItem(id));
        }
    };

    const handleEdit = (item) => {
        dispatch(fetchItemById(item.id));
        onEditClick(item);
    };

    if (items.length === 0) {
        return (
            <div className="item-list empty">
                <p>No items found. Create one to get started!</p>
            </div>
        );
    }

    return (
        <div className="item-list">
            <h2>Items List</h2>
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => dispatch(clearError())}>Dismiss</button>
                </div>
            )}
            <div className="items-container">
                {items.map((item) => (
                    <div key={item.id} className="item-card">
                        <div className="item-content">
                            <h3>{item.title}</h3>
                            <p>{item.description || 'No description'}</p>
                            <small className="item-id">ID: {item.id}</small>
                        </div>
                        <div className="item-actions">
                            <button
                                className="btn-edit"
                                onClick={() => handleEdit(item)}
                                disabled={loading}
                            >
                                Edit
                            </button>
                            <button
                                className="btn-delete"
                                onClick={() => handleDelete(item.id)}
                                disabled={loading}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemList;
