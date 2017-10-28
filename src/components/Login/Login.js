// @flow
import React, { Component } from "react";
import { observable, action, computed } from "mobx";
import { observer } from "mobx-react";
import classnames from "classnames";
import styles from "./Login.scss";

/* global SyntheticInputEvent */

type Props = {
  onLogin: (email: string, password: string) => Promise<*>
};

@observer
class Login extends Component<Props> {
  @observable email: string = "";
  @observable password: string = "";
  @observable isError: boolean = false;

  @action
  handleLogin = (event: Event) => {
    event.preventDefault();

    this.props.onLogin(this.email, this.password).catch(error => {
      this.isError = true;
    });
  };

  @action
  handleEmailChange = (event: SyntheticInputEvent<*>) => {
    this.isError = false;
    this.email = event.target.value;
  };

  @action
  handlePasswordChange = (event: SyntheticInputEvent<*>) => {
    this.isError = false;
    this.password = event.target.value;
  };

  @computed
  get isFormReady(): boolean {
    return !this.isError && !!this.email.trim() && !!this.password.trim();
  }

  render() {
    return (
      <form
        className={classnames(styles.root, { [styles.error]: this.isError })}
        onSubmit={this.handleLogin}
      >
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">
            Email
          </label>
          <input
            id="email"
            className={styles.input}
            type="text"
            value={this.email}
            onChange={this.handleEmailChange}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className={styles.input}
            type="password"
            value={this.password}
            onChange={this.handlePasswordChange}
          />
        </div>
        {this.isError && (
          <div className={classnames(styles.field, styles.errorMessage)}>
            Invalid credentials, please try again.
          </div>
        )}
        <div className={styles.submit}>
          <button
            type="submit"
            className={styles.button}
            disabled={!this.isFormReady}
          >
            Login
          </button>
        </div>
      </form>
    );
  }
}

export default Login;
