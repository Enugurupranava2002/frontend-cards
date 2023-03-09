import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import FormCard from "../../pages/Auth/FormCard";
import Card from "../../ui/card";
import LoadingSpinner from "../../ui/LoadingSpinner";

const VedioModal = (props) => {
  return (
    <>
      <div
        className="modal_backdrop"
        onClick={() => props.showVedioModalWindow(false)}
      />
      <div className="modal">
        <Card>
          <div className="modal-container">
            <h2 className="modal-container__heading">{props.card.name}</h2>

            <div className="vedio">
              <iframe
                width={"100%"}
                height={"100%"}
                src={props.card.source}
                frameBorder="0"
                title={props.card.name}
              />
            </div>
            <div className="vedio-actions">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  props.showVedioModalWindow(false);
                }}
                type="button"
              >
                close
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default VedioModal;
