import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Modal from "../../components/modal/modal";
import CardsList from "../../components/card/cardList";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { dataActions } from "../../store/data-slice";
import VedioModal from "../../components/vedioModal/vedioModal";

const ListOfCardsPage = (props) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cardData, setCardData] = useState({});

  const [cardsArr, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState({
    showModal: false,
    message: "",
  });
  const [showVedioModal, setShowVedioModal] = useState(false);

  const deleteArr = useSelector((state) => state.data.deleteDataIds);
  console.log(deleteArr);

  useEffect(() => {
    const graphqlQuery = {
      query: `
        query {
          getCards(_id: "${localStorage.getItem(
            "userId"
          )}", category: "${category}"){
            _id,
            name,
            source,
            category
          }
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
        console.log(resData.data);
        setCards(resData.data.getCards);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setShowErrorModal({ showModal: true, message: err.message });
      });
  }, []);

  console.log(cardsArr);

  const closeModal = (event) => {
    event.preventDefault();
    setShowErrorModal({ showModal: false, message: "" });
  };

  const getCard = (card) => {
    setCardData(card);
    setShowVedioModal(true);
  };

  const onClickDeleteAll = () => {
    const graphqlQuery = {
      query: `
        mutation {
          deleteAllSelectedCards(userId: "${localStorage.getItem(
            "userId"
          )}", cardIds: "${deleteArr}")
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
        dispatch(dataActions.emptyDeleteArr());
        setIsLoading(false);
        navigate("/postLoginPage");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showVedioModalWindow = (bool) => {
    setShowVedioModal(bool);
  };

  return (
    <div>
      {showVedioModal && (
        <VedioModal
          card={cardData}
          showVedioModalWindow={showVedioModalWindow}
        />
      )}
      <div className="categoryHeading">{`${category} cards`}</div>
      {showErrorModal.showModal ? (
        <Modal errorMessage={showErrorModal.message} closeModal={closeModal} />
      ) : (
        ""
      )}
      {!isLoading && cardsArr.length === 0 && (
        <div className="pageMessage">
          You don't have any cards in this category.
        </div>
      )}
      <CardsList setCard={getCard} cards={cardsArr} />
      {deleteArr.length !== 0 && (
        <button onClick={onClickDeleteAll} className="deleteAllButton">
          {isLoading ? (
            <div className="button-spinner">
              <LoadingSpinner />
            </div>
          ) : (
            "Delete All"
          )}
        </button>
      )}
    </div>
  );
};

export default ListOfCardsPage;
