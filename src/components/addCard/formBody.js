const FormBody = (props) => {
  return (
    <div className="new-card__controls">
      <div className="new-card__control">
        <label>
          Name<span className="star">*</span>
        </label>
        <input
          onChange={props.onChange}
          ref={props.nameRef}
          type="text"
          defaultValue={props.defaultData?.name}
        ></input>
      </div>
      <div className="new-card__control">
        <label>
          Category<span className="star">*</span>
        </label>
        <input
          onChange={props.onChange}
          ref={props.catRef}
          type="text"
          defaultValue={props.defaultData?.category}
        ></input>
      </div>
      <div className="new-card__control">
        <label>
          Source<span className="star">*</span>
        </label>
        <input
          onChange={props.onChange}
          ref={props.srcRef}
          type="text"
          defaultValue={props.defaultData?.source}
        ></input>
      </div>
    </div>
  );
};

export default FormBody;
