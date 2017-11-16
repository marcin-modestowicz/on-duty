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
      firebase
        .database()
        .ref(`/emailToUserId/${user.email.replace(/\./g, "%2E")}`)
        .once("value")
        .then(snapshot => {
          const userId = snapshot.val();

          if (userId) {
            runInAction("set userId", () => {
              this.userId = userId;
            });
          }
        });
    } else {
      runInAction("clear userId", () => {
        this.userId = null;
      });
    }
  };

  handleLogin = (email: string, password: string) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        if (error.code === "auth/user-not-found") {
          return this.handleRegistration(email, password);
        } else {
          throw error;
        }
      });
  };

  handleLogout = () => {
    return firebase
      .auth()
      .signOut()
      .catch(error => {
        console.log(error.message);
        throw error;
      });
  };

  handleRegistration = (email: string, password: string) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        const authId = user.uid;
        const sanitizedEmail = email.replace(/\./g, "%2E");

        return firebase
          .database()
          .ref(`/emailToUserId/${sanitizedEmail}`)
          .once("value")
          .then(snapshot => {
            const userId = snapshot.val();

            if (!userId) {
              firebase.auth().currentUser.delete();
              throw new Error("No account created for the user");
            }
          });
      })
      .catch(error => {
        console.log(error.message);
        throw error;
      });
  };
}

export default LoginStore;
