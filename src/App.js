//@flow
import React, { Component } from "react";
import { observer } from "mobx-react";
import LoginStore from "./stores/LoginStore";
import MainStore from "./stores/MainStore";
import Login from "./components/Login";
import AddUser from "./components/AddUser";
import ShowUser from "./components/ShowUser";
import Shifts from "./components/Shifts";
import styles from "./App.scss";

@observer
class App extends Component<null> {
  loginStore: LoginStore = new LoginStore();
  mainStore: MainStore = new MainStore();

  render() {
    const {
      isLoggedIn,
      isLoggingIn,
      user,
      handleLogin,
      handleLogout
    } = this.loginStore;
    const {
      users,
      addUser,
      fillCalendar,
      isReady,
      calendar,
      saveState,
      summary
    } = this.mainStore;

    if (isLoggingIn) {
      return null;
    }

    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <h2>On Duty</h2>
        </div>
        {!isLoggedIn && <Login onLogin={handleLogin} />}
        {isLoggedIn && (
          <div>
            <button onClick={handleLogout}>Logout</button>
            <div>
              <AddUser onAdd={addUser} />
              <button onClick={saveState}>Save state</button>
              <button onClick={fillCalendar} disabled={!isReady}>
                Create calendar
              </button>
              {users.map(user => <ShowUser key={user.id} user={user} />)}
            </div>
            <div>
              {calendar && (
                <Shifts calendar={calendar} summary={summary} users={users} />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
