import CategoryItem from "./categoryItem";

const CategoryList = (props) => {
  const categories = props.categories;
  const listElements = categories.map((category) => (
    <li key={category} className="cartList__li">
      <CategoryItem category={category} />
    </li>
  ));
  return <ul className="cartList">{listElements}</ul>;
};

export default CategoryList;
