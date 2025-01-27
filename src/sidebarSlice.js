// sidebarSlice.js
import { createSlice } from '@reduxjs/toolkit'

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    sidebarShow: true,
    unfoldable: false,
  },
  reducers: {
    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarShow = !state.sidebarShow
    },
    setUnfoldable: (state, action) => {
      state.unfoldable = action.payload
    },
  },
})

export const { setSidebarShow, toggleSidebar, setUnfoldable } = sidebarSlice.actions
export default sidebarSlice.reducer
