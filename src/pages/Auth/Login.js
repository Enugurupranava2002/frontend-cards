import React, { useEffect, useRef, useState } from "react";
import { useStateMachineInput } from "rive-react";
import { useDispatch } from "react-redux";

import Input from "../../components/auth/input";
import { required, length } from "../../util/validators";
import FormCard from "./FormCard";
import RiveAnimation from "../../components/auth/rive_animation";
import "../../dist/css/main.css";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../ui/LoadingSpinner";
import Modal from "../../components/modal/modal";
import { authActions } from "../../store/auth-slice";

const STATE_MACHINE_NAME = "Login Machine";

const Login = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [riveInstance, setRiveInstance] = useState(null);
  const [inputLookMultiplier, setInputLookMultiplier] = useState(0);
  const [state, setState] = useState({
    loginForm: {
      username: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })],
      },
      password: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })],
      },
      formIsValid: false,
      isLoading: false,
      error: null,
      showModal: false,
    },
  });

  const inputRef = useRef(null);
  const inputPassWordRef = useRef(null);
  const getRiveInstance = (rive) => {
    setRiveInstance(rive);
  };

  // teddy eye range is represented as 0 - 100 number scale
  useEffect(() => {
    if (inputRef?.current && !inputLookMultiplier) {
      // here we are dividing entire editable region to scale of 0 to 100 (after multiplying number of characters in user input)
      const fontSize = 15;
      const sizeOfInputFeild = inputRef.current.offsetWidth;
      const maxNumChars = sizeOfInputFeild / fontSize;
      setInputLookMultiplier(100 / maxNumChars - 2);
    }
  }, [inputRef, inputLookMultiplier]);

  const isCheckingInput = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    "isChecking"
  );

  const numLookInput = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    "numLook"
  );

  const isHandsUpInput = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    "isHandsUp"
  );

  const trigSuccessInput = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    "trigSuccess"
  );

  const trigFailInput = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    "trigFail"
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");

    if (!token || !expiryDate) {
      return;
    }

    if (new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }

    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();

    setAutoLogout(remainingMilliseconds);
    // navigate("/postLoginPage");
  });

  const setAutoLogout = (milliSeconds) => {
    const timer = setTimeout(() => {
      logoutHandler();
    }, milliSeconds);
  };

  const loginHandler = (event) => {
    event.preventDefault();

    setState((prevState) => {
      return { loginForm: { ...prevState.loginForm, isLoading: true } };
    });

    const graphqlQuery = {
      query: `
        {
          login(username: "${state.loginForm.username.value}", password: "${state.loginForm.password.value}"){
              token
              userId
          }
        }
      `,
    };

    fetch(
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_API_DEVELOPMENT
        : process.env.REACT_APP_API_PRODUCTION,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
        credentials: "include",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed. Make sure the username is valid!"
          );
        }

        if (resData.errors) {
          console.log(resData.errors);
          throw new Error(resData.errors[0].message || "User login failed!");
        }

        const remainingMilliseconds = 120 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );

        dispatch(
          authActions.setCreds({
            token: resData.data.login.token,
            userId: resData.data.login.userId,
            isAuth: true,
            expiryDate: expiryDate.toISOString(),
          })
        );

        setTimeout(() => {
          trigSuccessInput.fire();
        }, 1000);

        setTimeout(() => {
          setState((prevState) => {
            return {
              loginForm: { ...prevState.loginForm, isLoading: false },
            };
          });
          navigate("/postLoginPage");
          props.setAuth();
        }, 2000);

        localStorage.setItem("token", resData.data.login.token);
        localStorage.setItem("userId", resData.data.login.userId);

        // auto-Logout
        localStorage.setItem("expiryDate", expiryDate.toISOString());

        setAutoLogout(remainingMilliseconds);
      })
      .catch((err) => {
        setTimeout(() => {
          trigFailInput.fire();
        }, 2500);

        setTimeout(() => {
          setState((prevState) => {
            return {
              loginForm: {
                ...prevState.loginForm,
                isLoading: false,
                error: err,
                showModal: true,
              },
            };
          });
        }, 4000);
      });
  };

  const logoutHandler = () => {
    alert("Session expired. Please login again");
    dispatch(
      authActions.setCreds({
        token: "",
        isAuth: false,
        expiryDate: null,
        userId: "",
      })
    );
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const inputChangeHandler = (input, value) => {
    setState((prevState) => {
      let isValid = true;
      for (const validator of prevState.loginForm[input].validators) {
        isValid = isValid && validator(value);
      }
      let updatedForm = {};
      updatedForm = {
        ...prevState.loginForm,
        [input]: {
          ...prevState.loginForm[input],
          valid: isValid,
          value: value,
        },
      };

      if (input === "username") {
        numLookInput.value = value.length * inputLookMultiplier;
      }

      const formIsValid =
        updatedForm["username"].valid && updatedForm["password"].valid;

      return {
        ...prevState,
        loginForm: { ...updatedForm, formIsValid: formIsValid },
      };
    });
    numLookInput.value = value.length * inputLookMultiplier;
  };

  const inputFocusHandler = (input, value) => {
    if (input === "username") {
      isCheckingInput.value = true;
      numLookInput.value =
        numLookInput.value !== value.length * inputLookMultiplier
          ? value.length * inputLookMultiplier
          : numLookInput.value;
    } else {
      isHandsUpInput.value = true;
    }
  };

  const closeModal = (event) => {
    event.preventDefault();
    setState((prevState) => {
      return { loginForm: { ...prevState.loginForm, showModal: false } };
    });
  };

  return (
    <>
      {state.loginForm.showModal ? (
        <Modal
          errorMessage={state.loginForm.error.message}
          closeModal={closeModal}
        />
      ) : (
        ""
      )}

      <FormCard>
        <div className="form">
          <div className="form__title">
            <h2>Sign In</h2>
          </div>

          <RiveAnimation getRiveInstance={getRiveInstance} />

          <form onSubmit={loginHandler}>
            <Input
              inputRef={inputRef}
              id="username"
              label="Username"
              type="text"
              control="input"
              value={state.loginForm["username"].value}
              valid={
                state.loginForm["username"].value.length === 0
                  ? true
                  : state.loginForm["username"].valid
              }
              touched={state.loginForm["username"].touched}
              onChange={inputChangeHandler}
              onBlur={() => {
                isCheckingInput.value = false;
              }}
              onFocus={inputFocusHandler}
            />
            {!state.loginForm.username.valid &&
              state.loginForm.username.value.length > 0 && (
                <div className="error-message">
                  Should contain atleast 5 characters
                </div>
              )}

            <Input
              inputRef={inputPassWordRef}
              id="password"
              label="Password"
              type="password"
              control="input"
              value={state.loginForm["password"].value}
              valid={
                state.loginForm["password"].value.length === 0
                  ? true
                  : state.loginForm["password"].valid
              }
              touched={state.loginForm["password"].touched}
              onChange={inputChangeHandler}
              onBlur={() => {
                isHandsUpInput.value = false;
              }}
              onFocus={inputFocusHandler}
            />

            {!state.loginForm.password.valid &&
              state.loginForm.password.value.length > 0 && (
                <div className="error-message">
                  Should contain atleast 5 characters
                </div>
              )}

            <div className="form__actions">
              <div className="form__actions-login">
                <button type="submit" disabled={!state.loginForm.formIsValid}>
                  {state.loginForm.isLoading ? (
                    <div className="button-spinner">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
              <div className="form__actions-nav_container">
                <h6 className="form__actions-nav_container-info">
                  <Link to={"/sendConfirmation"}>
                    <span>Didn't Confirm yet?</span>
                  </Link>
                </h6>
                <h6 className="form__actions-nav_container-info">
                  Don't have an account?
                  <Link to="/signup">
                    <span>Signup</span>
                  </Link>
                </h6>
              </div>
            </div>
          </form>
        </div>
      </FormCard>
    </>
  );
};

export default Login;
