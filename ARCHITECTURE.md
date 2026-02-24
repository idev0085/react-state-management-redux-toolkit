# Redux Toolkit CRUD Architecture

## Complete Application Flow

```
                          REACT APP
                              │
                ┌─────────────┼─────────────┐
                │             │             │
            ItemForm       ItemList    ItemEditForm
          (CREATE)         (READ)       (UPDATE)
                │             │             │
                └─────────────┼─────────────┘
                              │
                    dispatch(thunk action)
                              │
                    ┌─────────┴─────────┐
                    │                   │
            Redux Store           React Components
         (itemsSlice)            (subscribe to state)
                    │
        ┌───────────┼───────────┐
        │           │           │
    items[]   selectedItem  loading/error
        │           │           │
        └───────────┼───────────┘
                    │
          Async Thunks (API calls)
                    │
        ┌───────────┼───────────┬───────────┬───────────┐
        │           │           │           │           │
     CREATE      READ        READ_ONE     UPDATE      DELETE
        │           │           │           │           │
        └───────────┼───────────┼───────────┼───────────┘
                    │
              EXPRESS.JS API
              (localhost:5000)
                    │
        ┌───────────┼───────────┬───────────┬───────────┐
        │           │           │           │           │
      POST        GET         GET/:id      PUT        DELETE
      /api    /api/items  /api/items/:id  /api     /api/items/:id
     /items                                /items
                    │
            In-Memory Data Store
              (items array)
```

## State Management Flow

### 1. FETCH Items (READ - on app load)

```
┌──────────────────────────────────────────────────┐
│                 App Component                    │
│                   useEffect                      │
│              dispatch(fetchItems())             │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│               itemsSlice.js                      │
│  fetchItems = createAsyncThunk(...)             │
│  • pending: set loading=true, error=null        │
│  • fulfilled: set items=[], loading=false       │
│  • rejected: set error="message", loading=false │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│         Backend API                             │
│   GET http://localhost:5000/api/items          │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│      Express Server (server.js)                  │
│    Route: app.get('/api/items', ...)           │
│    Returns: [{id, title, description}, ...]    │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│      Redux Store Updated                        │
│  state.items.items = [...]                     │
│  state.items.loading = false                   │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│        Components Re-Render                     │
│   ItemList shows all items in grid             │
└──────────────────────────────────────────────────┘
```

### 2. CREATE Item

```
┌──────────────────────────────────────────────────┐
│            ItemForm Component                    │
│  • User fills title & description               │
│  • Clicks "Add Item" button                     │
│  dispatch(createItem({title, description}))    │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│               itemsSlice.js                      │
│  createItem = createAsyncThunk(...)            │
│  • pending: set loading=true                   │
│  • fulfilled: push new item to items[]         │
│  • rejected: set error with message            │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│         Backend API                             │
│   POST http://localhost:5000/api/items         │
│   Body: {title: "...", description: "..."}     │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│      Express Server (server.js)                  │
│    Route: app.post('/api/items', ...)          │
│    • Generates unique UUID                     │
│    • Adds to items array                       │
│    Returns: {id, title, description}           │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│      Redux Store Updated                        │
│  state.items.items.push(newItem)               │
│  state.items.loading = false                   │
│  ItemForm fields cleared                       │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│        Components Re-Render                     │
│   ItemList shows new item in list              │
└──────────────────────────────────────────────────┘
```

### 3. UPDATE Item

```
┌──────────────────────────────────────────────────┐
│            ItemList Component                    │
│  • User clicks "Edit" button on item            │
│  dispatch(fetchItemById(id))                    │
│  → ItemEditForm shows with current data        │
│  dispatch(updateItem({id, itemData}))          │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│               itemsSlice.js                      │
│  updateItem = createAsyncThunk(...)            │
│  • pending: set loading=true                   │
│  • fulfilled: find & update item in items[]   │
│  • rejected: set error with message            │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│         Backend API                             │
│   PUT http://localhost:5000/api/items/:id      │
│   Body: {title: "...", description: "..."}     │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│      Express Server (server.js)                  │
│    Route: app.put('/api/items/:id', ...)       │
│    • Finds item by ID                          │
│    • Updates title/description                 │
│    Returns: {id, title, description}           │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│      Redux Store Updated                        │
│  state.items.items[index] = updatedItem        │
│  state.items.loading = false                   │
│  state.items.selectedItem = updatedItem        │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│        Components Re-Render                     │
│   ItemList shows updated item                  │
│   ItemEditForm closes                          │
└──────────────────────────────────────────────────┘
```

### 4. DELETE Item

```
┌──────────────────────────────────────────────────┐
│            ItemList Component                    │
│  • User clicks "Delete" button                  │
│  • Confirms in dialog                          │
│  dispatch(deleteItem(id))                      │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│               itemsSlice.js                      │
│  deleteItem = createAsyncThunk(...)            │
│  • pending: set loading=true                   │
│  • fulfilled: remove item from items[]         │
│  • rejected: set error with message            │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│         Backend API                             │
│   DELETE http://localhost:5000/api/items/:id   │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│      Express Server (server.js)                  │
│    Route: app.delete('/api/items/:id', ...)    │
│    • Finds item by ID                          │
│    • Removes from items array                  │
│    Returns: {id, title, description}           │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│      Redux Store Updated                        │
│  state.items.items.filter(item => item.id !== id)
│  state.items.loading = false                   │
└────────────────┬─────────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────────┐
│        Components Re-Render                     │
│   ItemList shows list without deleted item     │
└──────────────────────────────────────────────────┘
```

## Redux State Changes Timeline

```
TIME    ACTION          STATE BEFORE        STATE AFTER
────────────────────────────────────────────────────────────────
 0   App loads       {items:[], loading:false, error:null}
                            ↓
 1   dispatch        {items:[], loading:true,  error:null}
     fetchItems()    (API call starting)
                            ↓
 2   API returns     {items:[...], loading:false, error:null}
     success         (list now shows all items)
                            ↓
 3   User submits    {items:[...], loading:true,  error:null}
     create form     (creating new item)
                            ↓
 4   Item created    {items:[..., NEW], loading:false, error:null}
                     (new item added to list)
                            ↓
 5   API error       {items:[...], loading:false, error:"Msg"}
     on update       (user sees error notification)
                            ↓
 6   User dismisses  {items:[...], loading:false, error:null}
     error           (error cleared)
```

## Component Hierarchy

```
              App.js
              ├── Props: None
              ├── State: editingItem
              ├── Hooks: useDispatch, useSelector, useEffect
              │
              ├── ItemEditForm (if editingItem)
              │   ├── Props: item, onCancel, onItemUpdated
              │   ├── State: title, description
              │   ├── Hooks: useDispatch, useSelector, useEffect
              │   └── Actions: updateItem, clearSelectedItem
              │
              ├── ItemForm
              │   ├── Props: onItemCreated
              │   ├── State: title, description
              │   ├── Hooks: useDispatch, useSelector
              │   └── Actions: createItem, clearError
              │
              └── ItemList (if items.length > 0)
                  ├── Props: items, onEditClick
                  ├── Items rendered in map()
                  ├── Hooks: useDispatch, useSelector
                  └── Actions: deleteItem, fetchItemById
                              (via ItemCard buttons)
```

## Redux Action Flow

```
SYNC ACTIONS (Instant)
├── clearError()        → Removes error message immediately
└── clearSelectedItem() → Clears selected item immediately

ASYNC THUNKS (With API call)
├── fetchItems()
│   ├── Pending  → loading: true
│   ├── Success  → items: [], loading: false
│   └── Error    → error: "message", loading: false
│
├── fetchItemById()
│   ├── Pending  → loading: true
│   ├── Success  → selectedItem: {...}, loading: false
│   └── Error    → error: "message", loading: false
│
├── createItem()
│   ├── Pending  → loading: true
│   ├── Success  → items.push(), loading: false
│   └── Error    → error: "message", loading: false
│
├── updateItem()
│   ├── Pending  → loading: true
│   ├── Success  → items[i] = updated, loading: false
│   └── Error    → error: "message", loading: false
│
└── deleteItem()
    ├── Pending  → loading: true
    ├── Success  → items.filter(), loading: false
    └── Error    → error: "message", loading: false
```

## Key Redux Toolkit Features Used

```
createSlice()
├── name: "items"
├── initialState: {items, selectedItem, loading, error}
├── reducers: {clearError, clearSelectedItem}
└── extraReducers: {
    fetchItems.pending/fulfilled/rejected,
    fetchItemById.pending/fulfilled/rejected,
    createItem.pending/fulfilled/rejected,
    updateItem.pending/fulfilled/rejected,
    deleteItem.pending/fulfilled/rejected
}

configureStore()
├── reducer: {items: itemsReducer}
└── Built-in: Redux Thunk middleware, DevTools integration
```
