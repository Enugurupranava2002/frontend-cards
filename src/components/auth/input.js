import "../../dist/css/main.css";

const Input = (props) => {
  return (
    <div className="input">
      {props.label && (
        <label htmlFor={props.id}>
          {props.label}
          <span className="input__star">*</span>
        </label>
      )}
      <br />
      {props.control === "input" && (
        <input
          className={[
            !props.valid ? "invalid" : "valid",
            props.touched ? "touched" : "",
          ].join(" ")}
          type={props.type}
          id={props.id}
          required={props.required}
          value={props.value}
          placeholder={props.placeholder}
          onChange={(event) => props.onChange(props.id, event.target.value)}
          onBlur={props.onBlur}
          onFocus={
            props.hasOwnProperty("onFocus")
              ? (event) => props.onFocus(props.id, event.target.value)
              : () => {}
          }
          ref={props.inputRef}
        />
      )}
    </div>
  );
};

export default Input;
