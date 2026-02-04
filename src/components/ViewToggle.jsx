const ViewToggle = ({ viewMode, setViewMode, showCalendar = false }) => {
  return (
    <div className="view-toggle">
      {showCalendar && (
        <button
          className={`view-toggle-button ${
            viewMode === "calendar" ? "active" : ""
          }`}
          onClick={() => setViewMode("calendar")}
          title="Visualização em Calendário"
        >
          <i className="material-icons">calendar_month</i>
        </button>
      )}
      <button
        className={`view-toggle-button ${viewMode === "cards" ? "active" : ""}`}
        onClick={() => setViewMode("cards")}
        title="Visualização em Cards"
      >
        <i className="material-icons">view_module</i>
      </button>
      <button
        className={`view-toggle-button ${viewMode === "list" ? "active" : ""}`}
        onClick={() => setViewMode("list")}
        title="Visualização em Lista"
      >
        <i className="material-icons">view_list</i>
      </button>
    </div>
  );
};

export default ViewToggle;
