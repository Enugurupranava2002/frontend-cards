const Switch = (props) => {
  return (
    <div className="switch_container">
      <h6>Face Auth</h6>
      <label className={props.on ? "switch active" : "switch"}>
        <input type="switch_checkbox" />
        <span onClick={props.onClick} className="switch_slider" />
      </label>
    </div>
  );
};

export default Switch;
