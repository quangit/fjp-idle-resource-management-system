import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  login: (username) => {
    let role = 'Viewer';
    if (username.toLowerCase().includes('admin')) role = 'Admin';
    else if (username.toLowerCase().includes('ra')) role = 'RA';
    else if (username.toLowerCase().includes('mgr')) role = 'Manager';
    
    set({ 
      isAuthenticated: true, 
      user: { name: username, role } 
    });
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));

export default useAuthStore;
