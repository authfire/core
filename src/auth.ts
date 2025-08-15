import { useEffect, useState } from "react"
import { Auth, onAuthStateChanged, User, UserCredential } from "firebase/auth"
import { getServerToken, postRequest } from "./utils";
import { baseUrl, idTokenVerificationUrl, logEvent, serverSignOutUrl, serverTokenUrl, useFirebase } from "./const";

const verifyIdToken = async (user: User) => {
  if (!idTokenVerificationUrl) {
    console.error("ID Token verification URL is not set.");
    return false
  }

  const idToken = await user.getIdToken();
  if (!idToken) {
    console.error("User ID token is not available.")
    return false
  }

  const response = await postRequest(idTokenVerificationUrl, { idToken })
  if (!response.ok) {
    console.error('Failed to verify ID token:', response.statusText)
    return false
  }

  logEvent('id_token_verified', {
    uid: user.uid,
  });
  return true;
}

const signIn = async (callback: () => Promise<UserCredential>) => {
  let userCredential: UserCredential;

  try {
    userCredential = await callback();
  } catch (error) {
    console.error("Error signing in:", error);
    throw error; // Re-throw the error for further handling if needed
  }

  logEvent('signed_in', {
    uid: userCredential.user.uid,
  });

  return userCredential;
}

const signInWithServerToken = async (callback: (token: string) => Promise<UserCredential>) => {
  if (!serverTokenUrl) {
    throw new Error("Server token URL is not set.");
  }

  const serverToken = await getServerToken(serverTokenUrl);
  if (!serverToken) {
    throw new Error("Failed to retrieve token from server.");
  }

  return signIn(async () => {
    return await callback(serverToken);
  });
}

const signOut = async (auth: Auth) => {
  const uid = auth.currentUser?.uid;
  let redirectUrl = baseUrl

  if (serverSignOutUrl) {
    const response = await postRequest(serverSignOutUrl)

    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success') {
        logEvent('server_signed_out', {
          uid
        });
        redirectUrl = data.redirectUrl || redirectUrl;
      }
    }
  }

  await auth.signOut();

  logEvent('signed_out', {
    uid
  });

  window.location.href = redirectUrl;
  return true;
};

const useCurrentUser = () => {
  const { auth } = useFirebase();
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

    verifyIdToken(user)
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

export {
  verifyIdToken,
  signIn,
  signInWithServerToken,
  signOut,
  useCurrentUser
}
