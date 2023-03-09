import Card from "../../ui/card";
import HistoryDate from "./historyDate";

const HistoryItem = (props) => {
  return (
    <div className="historyItem">
      <Card>
        <div className="historyItem__container">
          <HistoryDate date={props.history.date} />
          <div className="name">{props.history.name}</div>
          <div className="link">{props.history.source}</div>
        </div>
      </Card>
    </div>
  );
};

export default HistoryItem;
