import { Auth, User } from "firebase/auth";
import { Analytics } from "firebase/analytics";
declare const useCurrentUser: (auth: Auth, idTokenVerificationUrl?: string, appCheckToken?: string, analytics?: Analytics) => {
    user: User | null;
    idTokenVerified: boolean | null;
};
export { useCurrentUser };
