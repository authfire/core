"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVerifyIdToken = exports.setAuth = exports.useCurrentUser = void 0;
const react_1 = require("react");
const auth_1 = require("firebase/auth");
let _auth;
let _verifyIdToken;
const setAuth = (auth) => {
    _auth = auth;
};
exports.setAuth = setAuth;
const setVerifyIdToken = (verifyIdToken) => {
    _verifyIdToken = verifyIdToken;
};
exports.setVerifyIdToken = setVerifyIdToken;
const useCurrentUser = () => {
    const [user, setUser] = (0, react_1.useState)(_auth.currentUser);
    const [idTokenVerified, setIdTokenVerified] = (0, react_1.useState)(null);
    (0, auth_1.onAuthStateChanged)(_auth, async (newUser) => {
        if (newUser?.uid === user?.uid) {
            return; // No change in user
        }
        setUser(newUser);
    });
    (0, react_1.useEffect)(() => {
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
};
exports.useCurrentUser = useCurrentUser;
