import useStore from "../store/useStore";
export default function useAuth(){
    const { isLoggedIn, user, login, logout } = useStore();
    return { isLoggedIn, user, login, logout };
}