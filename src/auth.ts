import { useEffect, useState } from "react"
import { Auth, onAuthStateChanged, User } from "firebase/auth"
import { Analytics } from "firebase/analytics";
import { AppCheck } from "firebase/app-check";
import { idTokenVerificationUrl, verifyIdToken } from "@authfire/jsfire";

const useCurrentUser = (auth: Auth, appCheck?: AppCheck, analytics?: Analytics) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [idTokenVerified, setIdTokenVerified] = useState<boolean | null>(null);

  onAuthStateChanged(auth, async (newUser) => {
    if (newUser?.uid === user?.uid) {
      return; // No change in user
    }

    setUser(newUser);
  });

  useEffect(() => {
    if (!user || !idTokenVerificationUrl) {
      setIdTokenVerified(null);
      return;
    }

    verifyIdToken(user, appCheck, analytics)
      .then(setIdTokenVerified).catch((error) => {
        console.error("Error checking sign-in verification:", error);
        setIdTokenVerified(false);
      }
    );
  }, [user]);

  return {
    user,
    idTokenVerified,
  };
}

export { useCurrentUser }
