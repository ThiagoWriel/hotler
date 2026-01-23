"use client";

const Search = ({ value, onChange, placeholder = "Buscar..." }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
      <i className="material-icons search-icon">search</i>
    </div>
  );
};

export default Search;
