import { useMemo } from "react";

const useSearch = (data, searchTerm = "") => {
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchTerm) return data;

    const lowerTerm = searchTerm.toLowerCase();

    return data.filter((item) => {
      // Iterate over all values of the object
      return Object.values(item).some((value) => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerTerm);
      });
    });
  }, [data, searchTerm]);

  return {
    filteredData,
  };
};

export default useSearch;
