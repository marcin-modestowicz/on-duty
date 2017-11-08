//@flow
import firebase from "../firebase";
import { observable, runInAction, computed } from "mobx";
import User from "../models/User";

class LoginStore {
  @observable userId: ?string;

  constructor() {
    firebase.auth().onAuthStateChanged(this.authObserver);
  }

  @computed
  get isLoggedIn(): boolean {
    return !!this.userId;
  }

  @computed
  get isLoggingIn(): boolean {
    return this.userId === undefined;
  }

  authObserver = (user: ?Object) => {
    if (user != null) {
      runInAction("set user id", () => {
        //$FlowFixMe - user cannot be null
        this.userId = user.uid;
      });
    } else {
      runInAction("clear user id", () => {
        this.userId = null;
      });
    }
  };

  handleLogin = (email: string, password: string) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        console.log(error.code, error.message);
        throw error;
      });
  };

  handleLogout = () => {
    return firebase
      .auth()
      .signOut()
      .catch(error => {
        console.log(error.code, error.message);
        throw error;
      });
  };
}

export default LoginStore;
