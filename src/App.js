//@flow
import React, { Component } from "react";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";
import LoginStore from "./stores/LoginStore";
import UserStore from "./stores/UserStore";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import ShowUser from "./components/ShowUser";
import Button from "./components/Button";
import styles from "./App.scss";

@observer
class App extends Component<null> {
  loginStore: LoginStore = new LoginStore();

  @computed
  get userStore(): UserStore {
    return new UserStore(this.loginStore.userId);
  }

  render() {
    const {
      isLoggedIn,
      isLoggingIn,
      handleLogin,
      handleLogout,
      userId
    } = this.loginStore;
    const { user, isAdmin } = this.userStore;

    if (isLoggingIn) {
      return null;
    }

    return (
      <div className={styles.root}>
        <header className={styles.header}>
          {isLoggedIn && (
            <Button onClick={handleLogout} marginless>
              Logout
            </Button>
          )}
          <h1 className={styles.heading}>On Duty</h1>
        </header>
        {!isLoggedIn && <Login onLogin={handleLogin} />}
        {isLoggedIn &&
          user &&
          !isAdmin && <ShowUser userStore={this.userStore} />}
        {isLoggedIn && isAdmin && <AdminPanel />}
      </div>
    );
  }
}

export default App;
