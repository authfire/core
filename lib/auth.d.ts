import { Auth, User, UserCredential } from "firebase/auth";
declare const verifyIdToken: (user: User) => Promise<boolean>;
declare const signIn: (callback: () => Promise<UserCredential>) => Promise<UserCredential>;
declare const signInWithServerToken: (callback: (token: string) => Promise<UserCredential>) => Promise<UserCredential>;
declare const signOut: (auth: Auth) => Promise<boolean>;
declare const useCurrentUser: () => {
    user: User | null | undefined;
    idTokenVerified: boolean | null;
};
export { verifyIdToken, signIn, signInWithServerToken, signOut, useCurrentUser };
