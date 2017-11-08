// @flow
import firebase from "../firebase";
import User from "../models/User";
import LoginStore from "./LoginStore";

describe("LoginStore store", () => {
  let localStorage;
  let onAuthStateChangedSpy;
  let signInWithEmailAndPasswordSpy;
  let signOutSpy;
  let loginStore;

  beforeAll(() => {
    onAuthStateChangedSpy = jest.fn();
    signInWithEmailAndPasswordSpy = jest.fn(() => Promise.resolve());
    signOutSpy = jest.fn(() => Promise.resolve());
    jest.spyOn(firebase, "auth").mockImplementation(() => ({
      onAuthStateChanged: onAuthStateChangedSpy,
      signInWithEmailAndPassword: signInWithEmailAndPasswordSpy,
      signOut: signOutSpy
    }));
  });

  afterAll(() => {
    // $FlowFixMe - jest bug https://github.com/facebook/jest/issues/4436
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    loginStore = new LoginStore();
  });

  describe("on initialization", () => {
    test("should call firebase auth and initialize observer", () => {
      expect(onAuthStateChangedSpy).toHaveBeenCalledWith(
        loginStore.authObserver
      );
    });
  });

  describe("authObserver method", () => {
    test("should set userId if user is passed as argument", () => {
      loginStore.authObserver({ uid: "test" });

      expect(loginStore.userId).toBe("test");
    });

    test("should clear userId if no user is passed as argument", () => {
      loginStore.authObserver();

      expect(loginStore.userId).toBeNull();
    });
  });

  describe("computed property isLoggedIn", () => {
    test("should return false if there's no userId", () => {
      loginStore.userId = null;

      expect(loginStore.isLoggedIn).toBeFalsy();
    });

    test("should return true if userId is set", () => {
      loginStore.userId = "a1";

      expect(loginStore.isLoggedIn).toBeTruthy();
    });
  });

  describe("computed property isLoggingIn", () => {
    test("should return true if userId was not initalized", () => {
      loginStore.userId = undefined;

      expect(loginStore.isLoggingIn).toBeTruthy();
    });

    test("should return false if there's no userId", () => {
      loginStore.userId = null;

      expect(loginStore.isLoggingIn).toBeFalsy();
    });

    test("should return false if userId is set", () => {
      loginStore.userId = "a1";

      expect(loginStore.isLoggingIn).toBeFalsy();
    });
  });

  describe("handleLogin method", () => {
    test("should call firebase auth signInWithEmailAndPassword method with provided email and password", () => {
      loginStore.handleLogin("test@email.com", "test123");

      expect(signInWithEmailAndPasswordSpy).toHaveBeenCalledWith(
        "test@email.com",
        "test123"
      );
    });
  });

  describe("handleLogout method", () => {
    test("should call firebase auth signOut method", () => {
      loginStore.handleLogout();

      expect(signOutSpy).toHaveBeenCalled();
    });
  });
});
