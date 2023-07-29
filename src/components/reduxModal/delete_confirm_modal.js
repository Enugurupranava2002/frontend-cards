import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { modalActions } from "../../store/modal-slice";
import Card from "../../ui/card";
import LoadingSpinner from "../../ui/LoadingSpinner";

const DeleteConfirmModal = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const id = useSelector((state) => state.modal.elementId);

  const bgClick = () => {
    dispatch(modalActions.showDeleteConfirmModalWindow(false));
  };

  const closeDeleteConfirmModal = (event) => {
    event.preventDefault();

    dispatch(modalActions.showDeleteConfirmModalWindow(false));
  };

  const confirm = (event) => {
    event.preventDefault();

    const graphqlQuery = {
      query: `
        mutation{
          deleteCard(userId: "${localStorage.getItem(
            "userId"
          )}", cardId: "${id}")
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
        console.log(resData);
        setIsLoading(false);
        dispatch(modalActions.showDeleteConfirmModalWindow(false));
        navigate("/postLoginPage");
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="darkBackGround" onClick={bgClick}></div>
      <div className="modal">
        <Card>
          <div className="modal-header">
            <h5>Dialog</h5>
          </div>
          <div className="modal-info">
            <p>Are you sure that you want to delete this item?</p>
          </div>
          <div className="modal-actions">
            <button onClick={closeDeleteConfirmModal}>Cancel</button>
            <button onClick={confirm}>
              {isLoading ? (
                <div className="button-spinner">
                  <LoadingSpinner />
                </div>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default DeleteConfirmModal;
