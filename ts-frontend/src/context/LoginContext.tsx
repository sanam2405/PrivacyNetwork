import { createContext } from 'react'


interface LoginContextType {
    setUserLogin: React.Dispatch<React.SetStateAction<boolean>>,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    userLogin: boolean,
}

export const LoginContext = createContext<LoginContextType>({} as LoginContextType)
