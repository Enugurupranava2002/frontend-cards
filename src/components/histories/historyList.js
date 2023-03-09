import HistoryItem from "./historyItem";

const HistoryList = (props) => {
  const histories = props.histories;
  const listElements = histories.map((history) => (
    <li key={history.date} className="historyList__li">
      <HistoryItem history={history} />
    </li>
  ));
  return <ul className="historyList">{listElements}</ul>;
};

export default HistoryList;
