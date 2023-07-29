import { useEffect, useState } from "react";
import HistoryList from "../../components/histories/historyList";
import Modal from "../../components/modal/modal";

const HistoryPage = (props) => {
  const [historiesArr, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState({
    showModal: false,
    message: "",
  });

  useEffect(() => {
    const graphqlQuery = {
      query: `
        query {
          getHistories(userId: "${localStorage.getItem("userId")}"){
            name,
            source, 
            date
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
        setHistories(resData.data.getHistories);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setShowErrorModal({ showModal: true, message: err.message });
      });
  }, []);

  const closeModal = (event) => {
    event.preventDefault();
    setShowErrorModal({ showModal: false, message: "" });
  };

  console.log(historiesArr);
  return (
    <div>
      {showErrorModal.showModal ? (
        <Modal errorMessage={showErrorModal.message} closeModal={closeModal} />
      ) : (
        ""
      )}
      {!isLoading && historiesArr.length === 0 && (
        <div className="pageMessage">You don't have any categories</div>
      )}
      <HistoryList histories={historiesArr} />
    </div>
  );
};

export default HistoryPage;
