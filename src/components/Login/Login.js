// @flow
import React, { Component } from "react";
import { observable, action, computed, runInAction } from "mobx";
import { observer } from "mobx-react";
import classnames from "classnames";
import TextInput from "../TextInput";
import Button from "../Button";
import Spinner from "./spinner.svg";
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
  @observable isLoading: boolean = false;

  @action
  handleLogin = (event: Event) => {
    event.preventDefault();

    this.isLoading = true;

    this.props.onLogin(this.email, this.password).catch(error => {
      runInAction("user login error", () => {
        this.isError = true;
        this.isLoading = false;
      });
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
          <TextInput
            id="email"
            value={this.email}
            label="Email"
            onChange={this.handleEmailChange}
            isInvalid={this.isError}
            marginless
          />
        </div>
        <div className={styles.field}>
          <TextInput
            id="password"
            type="password"
            value={this.password}
            label="Password"
            onChange={this.handlePasswordChange}
            isInvalid={this.isError}
            marginless
          />
        </div>
        {this.isError && (
          <div className={classnames(styles.field, styles.errorMessage)}>
            Invalid credentials, please try again.
          </div>
        )}
        <div className={styles.submit}>
          <Button
            type="submit"
            disabled={!this.isFormReady || this.isLoading}
            marginless
          >
            {this.isLoading && <Spinner />}
            Login
          </Button>
        </div>
      </form>
    );
  }
}

export default Login;
