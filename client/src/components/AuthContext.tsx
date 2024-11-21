import { createContext, ReactNode, useContext, useState, useEffect } from "react";

// real user type
type Credentials = {
    user?: any
}; 

type AuthContextType = Credentials & {
    setUser: (user: Credentials) => void,
    deleteUser: () => void,
};

const AuthContext = createContext<AuthContextType>({
    setUser: () => { },
    deleteUser: () => { }   
});

export default function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Credentials>({});

    function deleteUser() {
        localStorage.removeItem('user');
        setUser({});
    }

    function loginUser(user: Credentials) {
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    }

    useEffect(() => {
        // Checar si esta guardado en localStorage
        if (localStorage.getItem('user')) {
            setUser(JSON.parse(localStorage.getItem('user') as string) as Credentials);
        } else {
            // ir al login o lo que sea
        }
    }, []);

    return <AuthContext.Provider value={{
        user,
        setUser: loginUser,
        deleteUser
    }}>
        {children}
    </AuthContext.Provider>
}

export function useAuthContext() {
    return useContext(AuthContext);
}