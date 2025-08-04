import { useEffect, useState } from "react"
import { Auth, onAuthStateChanged, User } from "firebase/auth"

let _auth: Auth;
let _verifyIdToken: (user: User) => Promise<boolean>;

const setAuth = (auth: Auth) => {
  _auth = auth;
}

const setVerifyIdToken = (verifyIdToken: (user: User) => Promise<boolean>) => {
  _verifyIdToken = verifyIdToken;
}

const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(_auth.currentUser);
  const [idTokenVerified, setIdTokenVerified] = useState<boolean | null>(null);

  onAuthStateChanged(_auth, async (newUser) => {
    if (newUser?.uid === user?.uid) {
      return; // No change in user
    }

    setUser(newUser);
  });

  useEffect(() => {
    if (!user) {
      setIdTokenVerified(null);
      return;
    }

    _verifyIdToken(user).then(setIdTokenVerified).catch((error) => {
      console.error("Error checking sign-in verification:", error);
      setIdTokenVerified(false);
    });
  }, [user]);

  return {
    user,
    idTokenVerified,
  };
}

export { useCurrentUser, setAuth, setVerifyIdToken }
