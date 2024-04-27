import { useAuthContext } from './useAuthContext';
import {useItemsContext} from './useItemContext';

export const useLogout =()=>{
    const {dispatch : dispatchAuth} = useAuthContext();    
    const {dispatch: dispatchItems} = useItemsContext();

    const logout = ()=>{
        localStorage.removeItem('user');
        dispatchAuth({type: 'LOGOUT'})
        dispatchItems({type: 'SET_ITEMS', payload: null})
    }
    return {logout}
}