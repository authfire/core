import { Auth, User } from "firebase/auth";
import { Analytics } from "firebase/analytics";
import { AppCheck } from "firebase/app-check";
declare const useCurrentUser: (auth: Auth, appCheck?: AppCheck, analytics?: Analytics) => {
    user: User | null;
    idTokenVerified: boolean | null;
};
export { useCurrentUser };
