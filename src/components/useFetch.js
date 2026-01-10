import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

const useFetch = (table) => {
  const [fetchError, setFetchError] = useState(null);
  const [hotler, setHotler] = useState(null);
  const [orderBy, setOrderBy] = useState("id");
  const [isPending, setIsPending] = useState(true);

  const handleDelete = (id) => {
    setHotler((prevHotler) => {
      return prevHotler.filter((item) => item.id !== id);
    });
  };

  useEffect(() => {
    const fetchHotler = async () => {
      const { data, error } = await supabase
        .from(table)
        .select()
        .order(orderBy, { ascending: true });

      if (error) {
        setFetchError("Nao conseguiu acessar os dados da tabela");
        setHotler(null);
        console.log(error);
        setIsPending(false);
      }
      if (data) {
        setHotler(data);
        setIsPending(false);
        setFetchError(null);
      }
    };

    fetchHotler();
  }, [orderBy, table]);

  return { isPending, fetchError, hotler, orderBy, handleDelete, setOrderBy };
};

export default useFetch;
