import { useNavigate } from "react-router-dom";

import Card from "../../ui/card";

const CategoryItem = (props) => {
  const navigate = useNavigate();

  const onClick = (event) => {
    event.preventDefault();
    const category = event.target.lastChild.textContent;

    if (!category) {
      return;
    }

    navigate(`/listInCategories/${category}`);
  };

  return (
    <div onClick={onClick} className="cartItem">
      <Card>
        <div className="cartItem__container">{props.category}</div>
      </Card>
    </div>
  );
};

export default CategoryItem;
