import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import App from "./App";

const AppWrapper = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showEditModal = useSelector((state) => state.modal.showEditModal);
  const showDeleteConfirmModal = useSelector(
    (state) => state.modal.showDeleteConfirmModal
  );
  return (
    <App
      navigate={navigate}
      dispatch={dispatch}
      showEditModal={showEditModal}
      showDeleteConfirmModal={showDeleteConfirmModal}
    />
  );
};

export default AppWrapper;
