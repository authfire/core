import { Auth, User } from "firebase/auth";
declare const useCurrentUser: (auth: Auth) => {
    user: User | null;
    idTokenVerified: boolean | null;
};
export { useCurrentUser };
