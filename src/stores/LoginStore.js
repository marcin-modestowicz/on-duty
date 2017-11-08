//@flow
import firebase from "../firebase";
import { observable, runInAction, computed } from "mobx";
import User from "../models/User";

class LoginStore {
  @observable user: ?User;

  constructor() {
    firebase.auth().onAuthStateChanged(this.authObserver);
  }

  authObserver = (user: ?Object) => {
    if (user != null) {
      this.getUserData(user.uid);
    } else {
      this.clearUserData();
    }
  };

  @computed
  get isLoggedIn(): boolean {
    return !!this.user;
  }

  @computed
  get isLoggingIn(): boolean {
    return this.user === undefined;
  }

  @computed
  get isAdmin(): boolean {
    return !!this.user && this.user.isAdmin;
  }

  getUserData(userId: string) {
    const userData = localStorage.getItem("on-duty-user");
    if (!userData) {
      firebase
        .database()
        .ref(`/users/${userId}`)
        .once("value")
        .then(snapshot => {
          const user = snapshot.val();

          if (user) {
            runInAction("getUserData", () => {
              this.user = new User(
                userId,
                user.name,
                user.isDoctor,
                user.isSpecialist,
                undefined,
                user.isAdmin
              );
            });

            localStorage.setItem("on-duty-user", JSON.stringify(this.user));
          }
        });
    } else {
      const user = JSON.parse(userData);

      this.user = new User(
        userId,
        user.name,
        user.isDoctor,
        user.isSpecialist,
        user.availabilityCalendar.days.map(
          ({ availability: { status } }) => status
        ),
        user.isAdmin
      );
    }
  }

  clearUserData() {
    this.user = null;
    localStorage.removeItem("on-duty-user");
  }

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
