import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

const useFetch = (table) => {
  const [fetchError, setFetchError] = useState(null);
  const [hotler, setHotler] = useState(null);
  const [orderBy, setOrderBy] = useState(table === "quartos" ? "numero" : "id");
  const [isPending, setIsPending] = useState(true);

  const handleDelete = (id) => {
    setHotler((prevHotler) => {
      return prevHotler.filter((item) => item.id !== id);
    });
  };

  useEffect(() => {
    const fetchHotler = async () => {
      // Se for tabela de reservas, fazer JOIN com clientes e quartos
      const selectQuery =
        table === "reservas" ? "*, clientes(nome), quartos(numero)" : "*";

      const { data, error } = await supabase
        .from(table)
        .select(selectQuery)
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
