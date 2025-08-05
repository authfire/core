"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCurrentUser = void 0;
const react_1 = require("react");
const auth_1 = require("firebase/auth");
const jsfire_1 = require("@authfire/jsfire");
const useCurrentUser = (auth, appCheck, analytics) => {
    const [user, setUser] = (0, react_1.useState)(auth.currentUser);
    const [idTokenVerified, setIdTokenVerified] = (0, react_1.useState)(null);
    (0, auth_1.onAuthStateChanged)(auth, async (newUser) => {
        if (newUser?.uid === user?.uid) {
            return; // No change in user
        }
        setUser(newUser);
    });
    (0, react_1.useEffect)(() => {
        if (!user || !jsfire_1.idTokenVerificationUrl) {
            setIdTokenVerified(null);
            return;
        }
        (0, jsfire_1.verifyIdToken)(user, analytics)
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
