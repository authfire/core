import { FirebaseApp } from "firebase/app"
import { Auth } from "firebase/auth"
import { AppCheck } from "firebase/app-check"
import { Firestore } from "firebase/firestore"
import { FirebaseStorage } from "firebase/storage"
import { Analytics } from "firebase/analytics"

type Firebase = {
  app: FirebaseApp,
  appCheck: AppCheck,
  auth: Auth,
  firestore: Firestore,
  storage: FirebaseStorage,
  analytics: Analytics
}

let baseUrl: string
let idTokenVerificationUrl: string
let serverTokenUrl: string
let serverSignOutUrl: string
let useFirebase: (() => Firebase)
let getAppCheckToken: (() => Promise<string>)
let logEvent: ((eventName: string, eventParams?: Record<string, any>) => void)

type Options = {
  baseUrl: string
  idTokenVerificationUrl: string
  serverTokenUrl: string
  serverSignOutUrl: string
  useFirebase: () => Firebase
  getAppCheckToken: () => Promise<string>
  logEvent: (eventName: string, eventParams?: Record<string, any>) => void
}

const initialize = (options: Options) => {
  baseUrl = options.baseUrl;
  idTokenVerificationUrl = options.idTokenVerificationUrl;
  serverTokenUrl = options.serverTokenUrl;
  serverSignOutUrl = options.serverSignOutUrl;
  useFirebase = options.useFirebase;
  getAppCheckToken = options.getAppCheckToken;
  logEvent = options.logEvent;
}

export { initialize, baseUrl, idTokenVerificationUrl, serverTokenUrl, serverSignOutUrl, getAppCheckToken, logEvent, useFirebase };
