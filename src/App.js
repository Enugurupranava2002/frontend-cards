import React, { Component, Fragment } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import "./dist/css/main.css";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import SendConfirmation from "./pages/confirmation/sendConfirmation";
import Confirmation from "./pages/confirmation/confirmation";
import ConfirmationInfo from "./pages/confirmation/confirmationInfo";
import NavBar from "./components/navBar/navBar";
import PostLoginPage from "./pages/postLogin/postLoginPage";
import { authActions } from "./store/auth-slice";
import Form from "./components/addCard/form";
import CardsPage from "./pages/cards/CardsPage";
import EditModal from "./components/reduxModal/edit_modal";
import DeleteConfirmModal from "./components/reduxModal/delete_confirm_modal";
import HistoryPage from "./pages/history/historyPage";

class App extends Component {
  state = {
    isAuth: false,
    isLoading: false,
    error: null,
    showModal: false,
    showError: false,
    showConfirmationInfoPage: false,
  };

  initState = () => {
    this.setState({
      isAuth: false,
      isLoading: false,
      error: null,
      showModal: false,
      showError: false,
      showConfirmationInfoPage: false,
    });
  };

  signupHandler = (event, authData) => {
    event.preventDefault();

    this.setState((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const graphqlQuery = {
      query: `
            mutation {
              createUser(userInput: {email: "${authData.signupForm.email.value}", username: "${authData.signupForm.username.value}", password: "${authData.signupForm.password.value}", confirmPassword: "${authData.signupForm.confirmPassword.value}"}){
                _id
                username
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
          "content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      }
    )
      .then((res) => res.json())
      .then((resData) => {
        console.log(resData);
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            resData.errors[0].message ||
              "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (resData.errors) {
          console.log("resData", resData.errors);
          throw new Error(resData.errors[0].message || "User creation failed!");
        }
        this.initState();
        this.setState((prevState) => {
          return {
            ...prevState,
            showConfirmationInfoPage: true,
          };
        });
        this.props.navigate("confirmationInfo");
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isAuth: false,
          isLoading: false,
          error: err,
          showModal: true,
          showError: false,
          showConfirmationInfoPage: false,
        });
      });
  };

  // when user click confirmation link send through email this will get executed
  confirmation = (confirmationId) => {
    this.setState((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const graphqlQuery = {
      query: `
            mutation{
                confirmation(_id: "${confirmationId}"){
                    userId
                    expiredAt
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
          "content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      }
    )
      .then((res) => res.json())
      .then((resData) => {
        if (resData.errors) {
          throw new Error(
            resData.errors[0].message || "Error occured, please try again!"
          );
        }
        this.initState();
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isAuth: false,
          isLoading: false,
          error: err,
          showModal: false,
          showError: true,
          showConfirmationInfoPage: false,
        });
      });
  };

  closeModal = (event) => {
    event.preventDefault();
    this.initState();
  };

  setAuth = () => {
    this.setState((prevState) => {
      return { ...prevState, isAuth: true };
    });
  };

  setShowConfirmationInfoPage = (bool) => {
    this.setState((prevState) => {
      return { ...prevState, showConfirmationInfoPage: bool };
    });
  };

  sendConfirmation = (username) => {
    this.setState((prevState) => {
      return { ...prevState, isLoading: true };
    });

    this.props.navigate("confirmationInfo");

    const graphqlQuery = {
      query: `
        mutation{
            resendConfirmation(username: "${username}")
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
          "content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      }
    )
      .then((res) => res.json())
      .then((resData) => {
        if (resData.errors) {
          throw new Error(
            resData.errors[0].message || "Error occured, please try again!"
          );
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          showError: true,
          isAuth: false,
          isLoading: false,
          error: err,
          showModal: false,
          showConfirmationInfoPage: false,
        });
      });
  };

  logout = () => {
    alert("Session expired. Please login again");
    this.props.dispatch(
      authActions.setCreds({
        token: "",
        isAuth: false,
        expiryDate: null,
        userId: "",
      })
    );
    this.setState({ isAuth: false });
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
    this.props.navigate("/login");
  };

  render() {
    let routes = (
      <Routes>
        <Route
          path="/confirmation/:confirmationId"
          element={
            <Confirmation
              confirmation={this.confirmation}
              err={this.state.error}
              closeModal={this.closeModal}
              isLoading={this.state.isLoading}
              showError={this.state.showError}
            />
          }
        />
        {this.state.showConfirmationInfoPage && (
          <Route
            path="/confirmationInfo"
            element={
              <ConfirmationInfo
                err={this.state.error}
                closeModal={this.closeModal}
                isLoading={this.state.isLoading}
                showError={this.state.showError}
                setShowConfirmationInfoPage={this.setShowConfirmationInfoPage}
              />
            }
          />
        )}
        <Route
          path="/login"
          exact
          element={
            <>
              <Login
                loginHandler={this.loginHandler}
                isLoading={this.state.isLoading}
                error={this.state.error}
                closeModal={this.closeModal}
                showModal={this.state.showModal}
                setAuth={this.setAuth}
              />
            </>
          }
        />
        <Route
          path="/signup"
          exact
          element={
            <Signup
              {...this.props}
              onSignup={this.signupHandler}
              error={this.state.error}
              closeModal={this.closeModal}
              showModal={this.state.showModal}
              isLoading={this.state.isLoading}
              webcamRef={this.props.webcamRef}
            />
          }
        />
        <Route
          path="/sendConfirmation"
          exact
          element={
            <SendConfirmation sendConfirmation={this.sendConfirmation} />
          }
        />

        {this.state.isAuth && (
          <Route path="/postLoginPage" exact element={<PostLoginPage />} />
        )}

        {this.state.isAuth && (
          <Route path="/history" exact element={<HistoryPage />} />
        )}

        {this.state.isAuth && (
          <Route
            path="/listInCategories/:category"
            exact
            element={<CardsPage />}
          />
        )}

        {this.state.isAuth && (
          <Route path="/addItem" exact element={<Form />} />
        )}

        {/* <Route path="*" element={<PostLoginPage />} /> */}
        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );

    return (
      <Fragment>
        {this.props.showDeleteConfirmModal && <DeleteConfirmModal />}
        {this.props.showEditModal && <EditModal />}
        <NavBar onLogout={this.logout} isAuth={this.state.isAuth} />
        {routes}
      </Fragment>
    );
  }
}

export default App;
