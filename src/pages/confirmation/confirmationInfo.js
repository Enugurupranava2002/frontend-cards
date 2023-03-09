import { useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../ui/LoadingSpinner";
import FormCard from "../Auth/FormCard";

const ConfirmationInfo = (props) => {
  // this will remove access to this page when ever user navigate to new page or redirect to new page
  useEffect(() => {
    return () => {
      props.setShowConfirmationInfoPage(false);
    };
  }, []);

  return props.isLoading ? (
    <div className="page-spinner">
      <LoadingSpinner />
    </div>
  ) : (
    <FormCard>
      {props.showError ? (
        <div className="error__container">
          <div className="error__container-heading">Error!</div>
          <div className="error__container-info">
            <div className="error__container-info__message">
              {props.err.message}
            </div>
            <Link to={"/login"}>
              <span className="error__container-info__link">
                Go Back to Login Page
              </span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="confirmation_info">
          <div className="confirmation_info-icon">
            <span className="material-icons">interests</span>
          </div>
          <div className="confirmation_info-message">
            <h2>Thank you for showing interest!</h2>
          </div>
          <div className="confirmation_info-info">
            <p>A confirmation mail has been sent on your email.</p>
          </div>
          <Link to={"/login"}>
            <span className="confirmation_info-link">
              Go Back to Login Page
            </span>
          </Link>
        </div>
      )}
    </FormCard>
  );
};

export default ConfirmationInfo;
