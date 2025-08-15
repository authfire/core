"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCurrentUser = exports.signOut = exports.signInWithServerToken = exports.signIn = exports.verifyIdToken = void 0;
const react_1 = require("react");
const auth_1 = require("firebase/auth");
const utils_1 = require("./utils");
const const_1 = require("./const");
const verifyIdToken = async (user) => {
    if (!const_1.idTokenVerificationUrl) {
        console.error("ID Token verification URL is not set.");
        return false;
    }
    const idToken = await user.getIdToken();
    if (!idToken) {
        console.error("User ID token is not available.");
        return false;
    }
    const response = await (0, utils_1.postRequest)(const_1.idTokenVerificationUrl, { idToken });
    if (!response.ok) {
        console.error('Failed to verify ID token:', response.statusText);
        return false;
    }
    (0, const_1.logEvent)('id_token_verified', {
        uid: user.uid,
    });
    return true;
};
exports.verifyIdToken = verifyIdToken;
const signIn = async (callback) => {
    let userCredential;
    try {
        userCredential = await callback();
    }
    catch (error) {
        console.error("Error signing in:", error);
        throw error; // Re-throw the error for further handling if needed
    }
    (0, const_1.logEvent)('signed_in', {
        uid: userCredential.user.uid,
    });
    return userCredential;
};
exports.signIn = signIn;
const signInWithServerToken = async (callback) => {
    if (!const_1.serverTokenUrl) {
        throw new Error("Server token URL is not set.");
    }
    const serverToken = await (0, utils_1.getServerToken)(const_1.serverTokenUrl);
    if (!serverToken) {
        throw new Error("Failed to retrieve token from server.");
    }
    return signIn(async () => {
        return await callback(serverToken);
    });
};
exports.signInWithServerToken = signInWithServerToken;
const signOut = async (auth) => {
    const uid = auth.currentUser?.uid;
    let redirectUrl = const_1.baseUrl;
    if (const_1.serverSignOutUrl) {
        const response = await (0, utils_1.postRequest)(const_1.serverSignOutUrl);
        if (response.ok) {
            const data = await response.json();
            if (data.status === 'success') {
                (0, const_1.logEvent)('server_signed_out', {
                    uid
                });
                redirectUrl = data.redirectUrl || redirectUrl;
            }
        }
    }
    await auth.signOut();
    (0, const_1.logEvent)('signed_out', {
        uid
    });
    window.location.href = redirectUrl;
    return true;
};
exports.signOut = signOut;
const useCurrentUser = () => {
    const { auth } = (0, const_1.useFirebase)();
    const [user, setUser] = (0, react_1.useState)(auth.currentUser);
    const [idTokenVerified, setIdTokenVerified] = (0, react_1.useState)(null);
    (0, auth_1.onAuthStateChanged)(auth, async (newUser) => {
        if (newUser?.uid === user?.uid) {
            return; // No change in user
        }
        setUser(newUser);
    });
    (0, react_1.useEffect)(() => {
        if (!user || !const_1.idTokenVerificationUrl) {
            setIdTokenVerified(null);
            return;
        }
        verifyIdToken(user)
            .then(setIdTokenVerified).catch((error) => {
            console.error("Error checking sign-in verification:", error);
            setIdTokenVerified(false);
        });
    }, [user]);
    return {
        user,
        idTokenVerified,
    };
};
exports.useCurrentUser = useCurrentUser;
