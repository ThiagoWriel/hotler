"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getRole = async () => {
      // 1. Pega o usuário logado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 2. Busca SÓ o perfil dele (usando .single())
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id) // <--- O filtro importante
          .single(); // <--- Garante que vem só um objeto, não um array

        setRole(data?.role);
      }
      setLoading(false);
    };

    getRole();
  }, []);

  return { role, loading };
};

export default useUserRole;
