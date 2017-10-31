//@flow
import React, { Component } from "react";
import { observer } from "mobx-react";
import LoginStore from "./stores/LoginStore";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import ShowUser from "./components/ShowUser";
import styles from "./App.scss";

@observer
class App extends Component<null> {
  loginStore: LoginStore = new LoginStore();

  render() {
    const {
      isLoggedIn,
      isLoggingIn,
      isAdmin,
      user,
      handleLogin,
      handleLogout
    } = this.loginStore;

    if (isLoggingIn) {
      return null;
    }

    return (
      <div className={styles.root}>
        <h2 className={styles.header}>On Duty</h2>
        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        {!isLoggedIn && <Login onLogin={handleLogin} />}
        {isLoggedIn && <ShowUser user={user} />}
        {isLoggedIn && isAdmin && <AdminPanel />}
      </div>
    );
  }
}

export default App;
