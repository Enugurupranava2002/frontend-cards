import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../modal/modal";

import Card from "../../ui/card";
import LoadingSpinner from "../../ui/LoadingSpinner";
import FormBody from "./formBody";

const Form = (props) => {
  const nameRef = useRef();
  const catRef = useRef();
  const srcRef = useRef();

  const navigate = useNavigate();

  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState({
    showModal: false,
    message: "",
  });

  const userInputData = {};

  const onChange = (input, value) => {
    const isValid =
      nameRef.current.value !== "" &&
      catRef.current.value !== "" &&
      srcRef.current.value !== "";

    setIsFormValid(isValid);
  };

  const onSubmit = () => {
    userInputData["name"] = nameRef.current.value;
    userInputData["category"] = catRef.current.value;
    userInputData["source"] = srcRef.current.value;

    console.log(userInputData);

    const graphqlQuery = {
      query: `
        mutation {
          createCard(cardInput: {
            name: "${userInputData["name"]}",
            source: "${userInputData["source"]}",
            category: "${userInputData["category"]}",
            author: "${localStorage.getItem("userId")}"
          })
        }
      `,
    };

    setIsLoading(true);

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
          throw new Error(resData.errors[0].message);
        }

        setIsLoading(false);
        nameRef.current.value = null;
        catRef.current.value = null;
        srcRef.current.value = null;
        navigate("/postLoginPage");
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setShowErrorModal({ showModal: true, message: err.message });
      });
  };

  const onCancel = () => {
    nameRef.current.value = null;
    catRef.current.value = null;
    srcRef.current.value = null;

    navigate("/postLoginPage");
  };

  const closeModal = (event) => {
    event.preventDefault();
    setShowErrorModal({ showModal: false, message: "" });
  };

  return (
    <div className="form-container">
      {showErrorModal.showModal ? (
        <Modal errorMessage={showErrorModal.message} closeModal={closeModal} />
      ) : (
        ""
      )}
      <Card>
        <form>
          <FormBody
            nameRef={nameRef}
            catRef={catRef}
            srcRef={srcRef}
            onChange={onChange}
          />
          <div className="new-card__actions">
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
            <button disabled={!isFormValid} onClick={onSubmit} type="button">
              {isLoading ? (
                <div className="button-spinner">
                  <LoadingSpinner />
                </div>
              ) : (
                "Add card"
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Form;
