"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

export default function FeedbackDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const pathname = usePathname();
  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !message) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("feedback").insert({
        type,
        message,
        page_url: pathname,
      });

      if (error) throw error;

      toast.success("Feedback enviado com sucesso! Obrigado.");
      setOpen(false);
      setType("");
      setMessage("");
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      toast.error("Erro ao enviar feedback. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="">
          <i className="material-icons">feedback</i>
          Feedback
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar Feedback</DialogTitle>
          <DialogDescription>
            Encontrou um erro ou tem uma sugestão? Conte-nos!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select onValueChange={setType} value={type}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Feedback" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Erro / Bug</SelectItem>
                <SelectItem value="sugestao">Sugestão</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Textarea
              placeholder="Descreva seu feedback aqui..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none min-h-[120px]"
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
