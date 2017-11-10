// @flow
import firebase from "../firebase";
import User from "../models/User";
import LoginStore from "./LoginStore";

describe("LoginStore store", () => {
  let onAuthStateChangedMock;
  let signInWithEmailAndPasswordMock;
  let signOutMock;
  let refMock;
  let loginStore;

  beforeAll(() => {
    onAuthStateChangedMock = jest.fn();
    signInWithEmailAndPasswordMock = jest.fn(() => Promise.resolve());
    signOutMock = jest.fn(() => Promise.resolve());
    jest.spyOn(firebase, "auth").mockImplementation(() => ({
      onAuthStateChanged: onAuthStateChangedMock,
      signInWithEmailAndPassword: signInWithEmailAndPasswordMock,
      signOut: signOutMock
    }));
    refMock = jest.fn(() => ({
      once: () => Promise.resolve({ val: () => "testUserId" })
    }));
    jest
      .spyOn(firebase, "database")
      .mockImplementation(() => ({ ref: refMock }));
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
      expect(onAuthStateChangedMock).toHaveBeenCalledWith(
        loginStore.authObserver
      );
    });
  });

  describe("authObserver method", () => {
    describe("if user is passed as an argument", () => {
      beforeEach(() => {
        loginStore.authObserver({ uid: "test" });
      });

      test("should call firebase to get userId", () => {
        expect(refMock).toHaveBeenCalledWith("/authIdToUserId/test");
      });

      test("should set userId if user is passed as argument", () => {
        expect(loginStore.userId).toBe("testUserId");
      });
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

      expect(signInWithEmailAndPasswordMock).toHaveBeenCalledWith(
        "test@email.com",
        "test123"
      );
    });
  });

  describe("handleLogout method", () => {
    test("should call firebase auth signOut method", () => {
      loginStore.handleLogout();

      expect(signOutMock).toHaveBeenCalled();
    });
  });
});
