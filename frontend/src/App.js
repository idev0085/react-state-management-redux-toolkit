import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems } from './slices/itemsSlice';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import ItemEditForm from './components/ItemEditForm';
import './App.css';

function App() {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.items);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        dispatch(fetchItems());
    }, [dispatch]);

    const handleItemCreated = () => {
        dispatch(fetchItems());
    };

    const handleItemUpdated = () => {
        dispatch(fetchItems());
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
    };

    const handleEditCancel = () => {
        setEditingItem(null);
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>📝 Redux Toolkit CRUD App</h1>
                <p>Manage items with Redux Toolkit state management</p>
            </header>

            <main className="app-main">
                <div className="container">
                    {loading && <div className="loading">Loading items...</div>}

                    {editingItem && (
                        <ItemEditForm
                            item={editingItem}
                            onCancel={handleEditCancel}
                            onItemUpdated={handleItemUpdated}
                        />
                    )}

                    <ItemForm onItemCreated={handleItemCreated} />

                    {!loading && items.length > 0 && (
                        <ItemList items={items} onEditClick={handleEditClick} />
                    )}

                    {!loading && items.length === 0 && !error && (
                        <div className="empty-state">
                            <p>No items yet. Create your first item!</p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="app-footer">
                <p>Backend: http://localhost:5000</p>
            </footer>
        </div>
    );
}

export default App;
