import { useRef, useState } from "react";
import Input from "../../components/auth/input";
import "../../dist/css/main.css";

import FormCard from "../Auth/FormCard";
import { required, length, email } from "../../util/validators";

const SendConfirmation = (props) => {
  const inputRef = useRef();
  // const navigate = useNavigate();
  // const [error, setError] = useState(null);

  const [state, setState] = useState({
    resendConfirmation: {
      username: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })],
      },
      formIsValid: false,
    },
  });

  const inputChangeHandler = (input, value) => {
    setState((prevState) => {
      let isValid = true;
      for (const validator of prevState.resendConfirmation[input].validators) {
        isValid = isValid && validator(value);
      }
      let updatedForm = {};
      updatedForm = {
        ...prevState.resendConfirmation,
        [input]: {
          ...prevState.resendConfirmation[input],
          valid: isValid,
          value: value,
        },
      };

      let formIsValid = true;
      formIsValid = formIsValid && updatedForm[input].valid;

      console.log({ ...updatedForm, formIsValid: formIsValid });
      return {
        resendConfirmation: { ...updatedForm, formIsValid: formIsValid },
      };
    });
  };

  return (
    <FormCard>
      <div className="form" style={{ paddingTop: "0.1rem" }}>
        <div className="title">
          <h2 style={{ fontWeight: "500" }}>Resend Confirmation Mail...</h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.sendConfirmation(state.resendConfirmation.username.value);
          }}
        >
          <Input
            inputRef={inputRef}
            id="username"
            label="Your Username"
            type="text"
            control="input"
            value={state.resendConfirmation["username"].value}
            valid={
              state.resendConfirmation["username"].value.length === 0
                ? true
                : state.resendConfirmation["username"].valid
            }
            touched={state.resendConfirmation["username"].touched}
            onChange={inputChangeHandler.bind(this)}
          />
          {!state.resendConfirmation.username.valid &&
            state.resendConfirmation.username.value.length > 0 && (
              <div className="error-message">
                Should contain atleast 5 characters
              </div>
            )}

          <button
            type="submit"
            disabled={!state.resendConfirmation.formIsValid}
          >
            submit
          </button>
        </form>
      </div>
    </FormCard>
  );
};

export default SendConfirmation;
