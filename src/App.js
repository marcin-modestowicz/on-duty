//@flow
import React, { Component } from "react";
import { observer } from "mobx-react";
import MainStore from "./stores/MainStore";
import AddUser from "./components/AddUser";
import ShowUser from "./components/ShowUser";
import styles from "./App.scss";

@observer
class App extends Component<null> {
  mainStore: MainStore = new MainStore();

  render() {
    const { users, addUser } = this.mainStore;

    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <h2>On Duty</h2>
        </div>
        <div>
          <div>
            <AddUser onAdd={addUser} />
            {users.map(user => <ShowUser key={user.id} user={user} />)}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
