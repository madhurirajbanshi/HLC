

interface User {
    id: string;
    name: string;
    email: string;
}


interface UserState {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    clearUser: () => void;
    isAuthenticated: () => boolean;
}
