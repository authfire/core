import { Auth, User } from "firebase/auth";
declare const setAuth: (auth: Auth) => void;
declare const setVerifyIdToken: (verifyIdToken: (user: User) => Promise<boolean>) => void;
declare const useCurrentUser: () => {
    user: User | null;
    idTokenVerified: boolean | null;
};
export { useCurrentUser, setAuth, setVerifyIdToken };
