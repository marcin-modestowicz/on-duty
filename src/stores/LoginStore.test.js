// @flow
import firebase from "../firebase";
import User from "../models/User";
import LoginStore from "./LoginStore";

describe("LoginStore store", () => {
  let localStorage;
  let onAuthStateChangedSpy;
  let signInWithEmailAndPasswordSpy;
  let signOutSpy;
  let valSpy;
  let refSpy;
  let loginStore;

  beforeAll(() => {
    localStorage = global.localStorage;
    global.localStorage = {
      setItem: jest.fn(),
      removeItem: jest.fn(),
      getItem: jest.fn()
    };
    onAuthStateChangedSpy = jest.fn();
    signInWithEmailAndPasswordSpy = jest.fn(() => Promise.resolve());
    signOutSpy = jest.fn(() => Promise.resolve());
    jest.spyOn(firebase, "auth").mockImplementation(() => ({
      onAuthStateChanged: onAuthStateChangedSpy,
      signInWithEmailAndPassword: signInWithEmailAndPasswordSpy,
      signOut: signOutSpy
    }));
    valSpy = jest.fn();
    refSpy = jest.fn(() => ({ once: () => Promise.resolve({ val: valSpy }) }));
    jest
      .spyOn(firebase, "database")
      .mockImplementation(() => ({ ref: refSpy }));
  });

  afterAll(() => {
    global.localStorage = localStorage;

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
    test("should call getUserData if user is passed as argument", () => {
      jest.spyOn(loginStore, "getUserData").mockImplementation(() => {});
      loginStore.authObserver({ uid: "test" });

      expect(loginStore.getUserData).toHaveBeenCalledWith("test");
    });

    test("should call clearUserData if no user is passed as argument", () => {
      jest.spyOn(loginStore, "clearUserData").mockImplementation(() => {});
      loginStore.authObserver();

      expect(loginStore.clearUserData).toHaveBeenCalled();
    });
  });

  describe("computed property isLoggedIn", () => {
    test("should return false if there's no user data", () => {
      loginStore.user = null;

      expect(loginStore.isLoggedIn).toBeFalsy();
    });

    test("should return true if user data is fetched", () => {
      loginStore.user = new User("Jake Doe");

      expect(loginStore.isLoggedIn).toBeTruthy();
    });
  });

  describe("computed property isLoggingIn", () => {
    test("should return true if user was not initalized", () => {
      loginStore.user = undefined;

      expect(loginStore.isLoggingIn).toBeTruthy();
    });

    test("should return false if there's no user data", () => {
      loginStore.user = null;

      expect(loginStore.isLoggingIn).toBeFalsy();
    });

    test("should return false if user data is fetched", () => {
      loginStore.user = new User("Jake Doe");

      expect(loginStore.isLoggingIn).toBeFalsy();
    });
  });

  describe("getUserData method", () => {
    describe("if user data is stored in localStorage", () => {
      test("should create new user", () => {
        global.localStorage.getItem.mockImplementation(() =>
          JSON.stringify(new User("John Doe"))
        );

        loginStore.getUserData("userId");

        expect(loginStore.user && loginStore.user.name).toBe("John Doe");
      });
    });

    describe("if there's no user data stored in localStorage", () => {
      beforeEach(() => {
        global.localStorage.getItem.mockImplementation(() => null);
        valSpy.mockImplementation(() => ({
          firstName: "Jane",
          lastName: "Doe"
        }));
        loginStore.getUserData("userId");
      });

      test("should fetch user data", () => {
        expect(refSpy).toHaveBeenCalledWith("/users/userId");
      });

      test("should create new user", () => {
        expect(loginStore.user && loginStore.user.name).toBe("Jane Doe");
      });

      test("should store user data in localStorage", () => {
        expect(global.localStorage.setItem).toHaveBeenCalledWith(
          "on-duty-user",
          JSON.stringify(loginStore.user)
        );
      });
    });
  });

  describe("clearUserData method", () => {
    test("should clear user data", () => {
      loginStore.user = new User("Jill Doe");
      loginStore.clearUserData();

      expect(loginStore.user).toBeNull();
    });

    test("should remove user data from localStorage", () => {
      loginStore.clearUserData();

      expect(global.localStorage.removeItem).toHaveBeenCalledWith(
        "on-duty-user"
      );
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
