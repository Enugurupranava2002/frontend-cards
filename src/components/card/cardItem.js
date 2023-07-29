import { useState } from "react";
import { useDispatch } from "react-redux";

import { modalActions } from "../../store/modal-slice";
import { dataActions } from "../../store/data-slice";

import Card from "../../ui/card";

const CardItem = (props) => {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);

  const onClick = (event) => {
    event.preventDefault();
    const id = event.target.closest("li").id;

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

        const cardData = resData.data.getCard;

        const graphqlQuery = {
          query: `
            mutation {
              createHistory(historyInputData: {
                userId: "${localStorage.getItem("userId")}",
                name: "${cardData.name}",
                source: "${cardData.source}",
                date: "${new Date().toString()}"
              })
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
            props.setCard(cardData);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteCard = (event) => {
    event.preventDefault();

    dispatch(modalActions.showDeleteConfirmModalWindow(true));
    const id = event.target.closest("li").id;
    dispatch(modalActions.setElementId(id));
  };

  const editCard = (event) => {
    event.preventDefault();
    const id = event.target.closest("li").id;
    dispatch(modalActions.setElementId(id));
    dispatch(modalActions.showEditWindow(true));
  };

  const onClickCheck = (event) => {
    event.preventDefault();
    const id = event.target.closest("li").id;

    if (isChecked === true) {
      setIsChecked(false);
      dispatch(dataActions.removeFromDelete(id));
    } else {
      setIsChecked(true);
      dispatch(dataActions.addToDelete(id));
    }
  };

  return (
    <div className="cardItem">
      <Card>
        <div className="cardItem__card">
          <div onClick={onClick} className="cardItem__container">
            {props.card.name}
          </div>
          <div className="cardItem__actions">
            <i onClick={editCard} className="material-icons">
              edit
            </i>
            <i onClick={deleteCard} className="material-icons">
              delete
            </i>
          </div>
          <div className="cardItem__check">
            <label name="checkbox">Delete</label>
            <div
              onClick={onClickCheck}
              className={`${isChecked ? "check_ok" : "check"}`}
            ></div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CardItem;
