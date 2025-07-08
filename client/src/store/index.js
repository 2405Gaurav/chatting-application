    import { create } from "zustand";
    import { createAuthslice } from "./slices/auth-slice";

    export const useAppStore=create()((...a)=>({
        ...createAuthslice(...a),
        

    }))