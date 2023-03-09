import { createSlice } from "@reduxjs/toolkit";

// data: [
//     {
//       key: "1",
//       name: "abcd",
//       source: "https://www.youtube.com/watch?v=-K8HP_XKXtk",
//       bucket: "Education",
//     },
//     {
//       key: "2",
//       name: "123",
//       source: "https://www.youtube.com/watch?v=EfdJlfYDBp8",
//       bucket: "School",
//     },
//     {
//       key: "3",
//       name: "1",
//       source: "https://www.youtube.com/watch?v=-K8HP_XKXtk",
//       bucket: "Business",
//     },
//     {
//       key: "4",
//       name: "2",
//       source: "https://www.youtube.com/watch?v=l0bpy857deM",
//       bucket: "Agriculture",
//     },
//     {
//       key: "5",
//       name: "a12",
//       source: "https://www.youtube.com/watch?v=ha4tRQwKIUg",
//       bucket: "Shop",
//     },
//     {
//       key: "6",
//       name: "a231",
//       source: "https://www.youtube.com/embed/G8csJtDwjzk",
//       bucket: "College",
//     },
//   ],

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
