import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { modalActions } from "../../store/modal-slice";
import "../../dist/css/main.css";
import Card from "../../ui/card";
import FormBody from "../../components/addCard/formBody";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const EditModal = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState({});
  const navigate = useNavigate();

  const closeEditModal = () => {
    dispatch(modalActions.showEditWindow(false));
  };

  const bgClick = () => {
    dispatch(modalActions.showEditWindow(false));
  };

  const nameRef = useRef();
  const catRef = useRef();
  const srcRef = useRef();

  const id = useSelector((state) => state.modal.elementId);

  useEffect(() => {
    const graphqlQuery = {
      query: `
        query {
          getCard(userId: "${localStorage.getItem("userId")}", cardId: "${id}"){
            _id,
            name,
            source,
            category
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
          throw new Error(resData.errors[0].message);
        }
        console.log(resData);
        setCardData(resData.data.getCard);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onConfirm = () => {
    const graphqlQuery = {
      query: `
        mutation{
          updateCard(cardUpdateData: {
            name: "${nameRef.current.value}",
            source: "${srcRef.current.value}",
            category: "${catRef.current.value}",
            author: "${localStorage.getItem("userId")}",
            _id: "${id}"
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
        console.log(resData);
        setIsLoading(false);
        dispatch(modalActions.showEditWindow(false));
        navigate("/postLoginPage");
        nameRef.current.value = null;
        catRef.current.value = null;
        srcRef.current.value = null;
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
            <h5>Edit</h5>
          </div>
          <FormBody
            nameRef={nameRef}
            catRef={catRef}
            srcRef={srcRef}
            defaultData={cardData}
            onChange={null}
          />
          <div className="modal-actions">
            <button onClick={closeEditModal}>Cancel</button>
            <button onClick={onConfirm}>
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

export default EditModal;
