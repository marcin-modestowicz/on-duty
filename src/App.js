import React, { Component } from "react";
import styles from "./App.scss";

class App extends Component {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <h2>On Duty</h2>
        </div>
      </div>
    );
  }
}

export default App;
