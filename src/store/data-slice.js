import { createSlice } from "@reduxjs/toolkit";

const initDataState = {
  deleteDataIds: [],
  historyDataIds: [],
};

const dataSlice = createSlice({
  name: "dataSlice",
  initialState: initDataState,
  reducers: {
    addToDelete(state, action) {
      state.deleteDataIds.push(action.payload);
    },
    addToHistory(state, action) {
      const index = state.historyDataIds.indexOf(action.payload);
      if (index === -1) {
        state.historyDataIds.push(action.payload);
      }
    },
    removeFromDelete(state, action) {
      const index = state.deleteDataIds.indexOf(action.payload);
      if (index > -1) {
        state.deleteDataIds.splice(index, 1);
      }
    },
    emptyDeleteArr(state, action) {
      state.deleteDataIds.splice(0, state.deleteDataIds.length);
    },
  },
});

export default dataSlice.reducer;
export const dataActions = dataSlice.actions;
