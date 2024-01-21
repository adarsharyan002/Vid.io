import create from "zustand";
import axios from "axios";

const useStore = create((set) => ({
  data: [],
  loading: false,
  hasErrors: false,
  fetch: async (body) => {
    set(() => ({ loading: true }));
    try {
      const response = await axios.post("uri",body);
      set((state) => ({ data: (state.data = response.data), loading: false }));
    } catch (err) {
      set(() => ({ hasErrors: true, loading: false }));
    }
  },
}));

export default useStore;