import Card from "../../ui/card";

import "../../dist/css/main.css";

const FormCard = (props) => (
  <section className="form_container">
    <Card>{props.children}</Card>
  </section>
);

export default FormCard;
