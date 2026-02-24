import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/api';

// Async Thunks for API calls
export const fetchItems = createAsyncThunk(
    'items/fetchItems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/items`);
            if (!response.ok) throw new Error('Failed to fetch items');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchItemById = createAsyncThunk(
    'items/fetchItemById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/items/${id}`);
            if (!response.ok) throw new Error('Failed to fetch item');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createItem = createAsyncThunk(
    'items/createItem',
    async (itemData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData),
            });
            if (!response.ok) throw new Error('Failed to create item');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateItem = createAsyncThunk(
    'items/updateItem',
    async ({ id, itemData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData),
            });
            if (!response.ok) throw new Error('Failed to update item');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteItem = createAsyncThunk(
    'items/deleteItem',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/items/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete item');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
};

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedItem: (state) => {
            state.selectedItem = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Items
        builder
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch Item By ID
        builder
            .addCase(fetchItemById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItemById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedItem = action.payload;
            })
            .addCase(fetchItemById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create Item
        builder
            .addCase(createItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update Item
        builder
            .addCase(updateItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateItem.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.selectedItem = action.payload;
            })
            .addCase(updateItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Delete Item
        builder
            .addCase(deleteItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((item) => item.id !== action.payload.id);
            })
            .addCase(deleteItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSelectedItem } = itemsSlice.actions;
export default itemsSlice.reducer;
