import { Link, useParams } from "react-router-dom";

import FormCard from "../Auth/FormCard";
import "../../dist/css/main.css";
import { useLayoutEffect } from "react";
import LoadingSpinner from "../../ui/LoadingSpinner";

const Confirmation = (props) => {
  const confirmationId = useParams().confirmationId;

  useLayoutEffect(() => {
    props.confirmation(confirmationId);
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
        <div className="confirmation__container">
          <div className="confirmation__container-logo">
            <div className="confirmation__container-logo__horz"></div>
            <div className="confirmation__container-logo__vert"></div>
          </div>
          <div className="confirmation__container-info">
            <div className="confirmation__container-info__message">
              Thanks for Confirmation!
            </div>
            <Link to={"/login"}>
              <span className="confirmation__container-info__link">
                Go Back to Login Page
              </span>
            </Link>
          </div>
        </div>
      )}
    </FormCard>
  );
};

export default Confirmation;
