import { useAuthContext } from './useAuthContext';

export const useLogout =()=>{
    const {dispatch : dispatchAuth} = useAuthContext();    

    const logout = ()=>{
        localStorage.removeItem('user');
        dispatchAuth({type: 'LOGOUT'})
    }
    return {logout}
}