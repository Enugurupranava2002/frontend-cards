import { createSlice } from "@reduxjs/toolkit";

const initialModalState = {
  showEditModal: false,
  elementId: null,
  showDeleteConfirmModal: false,
};

const modalSlice = createSlice({
  name: "modals",
  initialState: initialModalState,
  reducers: {
    showEditWindow(state, action) {
      state.showEditModal = action.payload;
    },
    showDeleteConfirmModalWindow(state, action) {
      state.showDeleteConfirmModal = action.payload;
    },
    setElementId(state, action) {
      state.elementId = action.payload;
    },
  },
});

export default modalSlice.reducer;
export const modalActions = modalSlice.actions;
