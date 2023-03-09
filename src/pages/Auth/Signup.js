import { Component } from "react";
import { Link } from "react-router-dom";

import Input from "../../components/auth/input";
import { required, length, email } from "../../util/validators";
import FormCard from "./FormCard";
import "../../dist/css/main.css";
import Modal from "../../components/modal/modal";
import LoadingSpinner from "../../ui/LoadingSpinner";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signupForm: {
        email: {
          value: "",
          valid: false,
          touched: false,
          validators: [required, email],
        },
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
        confirmPassword: {
          value: "",
          valid: false,
          touched: false,
          validators: [],
        },
        formIsValid: false,
      },
    };
  }

  inputChangeHandler = (input, value) => {
    this.setState((prevState) => {
      let isValid = true;
      prevState.signupForm[input].validators.forEach((validator) => {
        isValid = isValid && validator(value);
      });

      const updatedForm = {
        ...prevState.signupForm,
        [input]: {
          ...prevState.signupForm[input],
          valid: isValid !== undefined ? isValid : false,
          value: value !== undefined ? value : "",
        },
      };

      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid =
          formIsValid &&
          (updatedForm[inputName].valid === undefined
            ? true
            : updatedForm[inputName].valid);
      }

      return {
        signupForm: { ...updatedForm, formIsValid: formIsValid },
      };
    });
  };

  inputBlurHandler = (input) => {
    this.setState((prevState) => {
      return {
        signupForm: {
          ...prevState.signupForm,
          [input]: {
            ...prevState.signupForm[input],
            touched: true,
          },
        },
      };
    });
  };

  render() {
    return (
      <>
        {this.props.showModal ? (
          <Modal
            errorMessage={this.props.error.message}
            closeModal={this.props.closeModal}
          />
        ) : (
          ""
        )}
        <FormCard>
          <div className="form">
            <div className="form__title">
              <h2>Sign Up</h2>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.props.onSignup(e, this.state);
              }}
            >
              <Input
                id="username"
                label="Username"
                type="text"
                control="input"
                value={this.state.signupForm["username"].value}
                valid={
                  this.state.signupForm["username"].value.length === 0
                    ? true
                    : this.state.signupForm["username"].valid
                }
                touched={this.state.signupForm["username"].touched}
                onChange={this.inputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, "username")}
              />
              {!this.state.signupForm.username.valid &&
                this.state.signupForm.username.value.length > 0 && (
                  <div className="error-message">
                    Should contain atleast 5 characters
                  </div>
                )}

              <Input
                id="email"
                label="Your Email"
                type="email"
                control="input"
                value={this.state.signupForm["email"].value}
                valid={
                  this.state.signupForm["email"].value.length === 0
                    ? true
                    : this.state.signupForm["email"].valid
                }
                touched={this.state.signupForm["email"].touched}
                onChange={this.inputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, "email")}
              />
              {!this.state.signupForm.email.valid &&
                this.state.signupForm.email.value.length > 0 && (
                  <div className="error-message">
                    enter a valid email address
                  </div>
                )}

              <Input
                id="password"
                label="Password"
                type="password"
                control="input"
                value={this.state.signupForm["password"].value}
                valid={
                  this.state.signupForm["password"].value.length === 0
                    ? true
                    : this.state.signupForm["password"].valid
                }
                touched={this.state.signupForm["password"].touched}
                onChange={this.inputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, "password")}
              />
              {!this.state.signupForm.password.valid &&
                this.state.signupForm.password.value.length > 0 && (
                  <div className="error-message">
                    Should contain atleast 5 characters
                  </div>
                )}

              <Input
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                control="input"
                value={this.state.signupForm["confirmPassword"].value}
                valid={
                  this.state.signupForm["confirmPassword"].value.length === 0
                    ? true
                    : this.state.signupForm["confirmPassword"].valid
                }
                touched={this.state.signupForm["confirmPassword"].touched}
                onChange={this.inputChangeHandler}
                onBlur={this.inputBlurHandler.bind(this, "confirmPassword")}
              />
              {this.state.signupForm.confirmPassword.value.length > 0 &&
                this.state.signupForm.confirmPassword.value !==
                  this.state.signupForm.password.value && (
                  <div className="error-message">password mis-match</div>
                )}

              <div className="form__actions">
                <div className="form__actions-login">
                  <button
                    type="submit"
                    disabled={!this.state.signupForm.formIsValid}
                  >
                    {this.props.isLoading ? (
                      <div className="button-spinner">
                        <LoadingSpinner />
                      </div>
                    ) : (
                      "Sign Up"
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
                    Have an account?
                    <Link to="/">
                      <span>SignIn</span>
                    </Link>
                  </h6>
                </div>
              </div>
            </form>
          </div>
        </FormCard>
      </>
    );
  }
}

export default Signup;
