import FormCard from "../../pages/Auth/FormCard";

const Modal = (props) => {
  return (
    <>
      <div className="modal_backdrop" onClick={props.closeModal} />
      <div className="modal">
        <FormCard>
          <div className="modal-container">
            <div className="modal-container__close" onClick={props.closeModal}>
              X
            </div>
            <h2 className="modal-container__heading">Error</h2>
            <p className="modal-container__body">{props.errorMessage}</p>
            <button onClick={props.closeModal} type="button">
              close
            </button>
          </div>
        </FormCard>
      </div>
    </>
  );
};

export default Modal;
