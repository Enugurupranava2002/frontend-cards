import CardItem from "./cardItem";

const CardsList = (props) => {
  const cards = props.cards;
  const listElements = cards.map((card) => (
    <li id={card._id} key={card._id} className="cardList__li">
      <CardItem setCard={props.setCard} card={card} />
    </li>
  ));
  return <ul className="cardList">{listElements}</ul>;
};

export default CardsList;
