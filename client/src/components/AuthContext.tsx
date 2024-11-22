import { createContext, ReactNode, useContext, useState, useEffect } from "react";

type User = {
    id: string;
    username: string;
    // Otros campos necesarios
};

type Credentials = {
    user: User | null;
};

type AuthContextType = {
    user: User | null;
    setUser: (user: Credentials) => void;
    deleteUser: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    deleteUser: () => { }
});

export default function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    function deleteUser() {
        localStorage.removeItem('user');
        setUser(null);
    }

    function loginUser(credentials: Credentials) {
        deleteUser(); // Limpia cualquier usuario previo
        localStorage.setItem('user', JSON.stringify(credentials.user));
        setUser(credentials.user);
    }

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser) as User);
            }
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            deleteUser();
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            setUser: loginUser,
            deleteUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}
