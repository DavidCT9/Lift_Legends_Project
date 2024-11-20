import { createContext, ReactNode, useContext, useState } from "react";

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
        setUser({});
    }

    return <AuthContext.Provider value={{
        user,
        setUser,
        deleteUser
    }}>
        {children}
    </AuthContext.Provider>
}

export function useAuthContext() {
    return useContext(AuthContext);
}