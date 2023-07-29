import { useEffect, useState } from "react";
import Modal from "../../components/modal/modal";
import CategoryList from "../../components/categories/categoryList";

const PostLoginPage = () => {
  const [categoriesArr, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState({
    showModal: false,
    message: "",
  });

  useEffect(() => {
    const graphqlQuery = {
      query: `
        query {
          getCategories(_id: "${localStorage.getItem("userId")}")
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
        setCategories(resData.data.getCategories);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setShowErrorModal({ showModal: true, message: err.message });
      });
  }, []);

  console.log(categoriesArr);

  const closeModal = (event) => {
    event.preventDefault();
    setShowErrorModal({ showModal: false, message: "" });
  };

  return (
    <div>
      {showErrorModal.showModal ? (
        <Modal errorMessage={showErrorModal.message} closeModal={closeModal} />
      ) : (
        ""
      )}
      {!isLoading && categoriesArr.length === 0 && (
        <div className="pageMessage">You don't have any categories</div>
      )}
      <CategoryList categories={categoriesArr} />
    </div>
  );
};

export default PostLoginPage;
