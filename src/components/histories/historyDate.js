const HistoryDate = (props) => {
  const month = new Date(props.date).toLocaleString("en-US", { month: "long" });
  const day = new Date(props.date).toLocaleString("en-US", { day: "2-digit" });
  const year = new Date(props.date).getFullYear();

  return (
    <div className="history-date">
      <div className="history-date__month">{month}</div>
      <div className="history-date__day">{day}</div>
      <div className="history-date__year">{year}</div>
    </div>
  );
};

export default HistoryDate;
