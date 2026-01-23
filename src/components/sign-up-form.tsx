"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateAccessKey = async (
    supabase: ReturnType<typeof createClient>,
  ) => {
    if (!accessKey.trim()) {
      throw new Error("Chave de acesso é obrigatória");
    }

    const { data: keyData, error: keyError } = await supabase
      .from("access_keys")
      .select("*")
      .eq("key", accessKey.trim())
      .eq("is_active", true)
      .single();

    if (keyError || !keyData) {
      throw new Error("Chave de acesso inválida");
    }

    // Verificar se a chave expirou
    if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
      throw new Error("Chave de acesso expirada");
    }

    // Verificar limite de usos
    if (keyData.max_uses !== null && keyData.current_uses >= keyData.max_uses) {
      throw new Error("Chave de acesso esgotada");
    }

    return keyData.id;
  };

  const incrementKeyUsage = async (
    supabase: ReturnType<typeof createClient>,
    keyId: string,
  ) => {
    await supabase
      .from("access_keys")
      .update({ current_uses: supabase.rpc ? undefined : undefined })
      .eq("id", keyId);

    // Usar RPC ou update direto
    const { error } = await supabase.rpc("increment_access_key_usage", {
      key_id: keyId,
    });

    // Se RPC não existir, fazer update manual
    if (error) {
      const { data: keyData } = await supabase
        .from("access_keys")
        .select("current_uses")
        .eq("id", keyId)
        .single();

      if (keyData) {
        await supabase
          .from("access_keys")
          .update({ current_uses: keyData.current_uses + 1 })
          .eq("id", keyId);
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    try {
      // Validar chave de acesso primeiro
      const keyId = await validateAccessKey(supabase);

      // Se a chave for válida, prosseguir com o cadastro
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;

      // Incrementar uso da chave após cadastro bem-sucedido
      await incrementKeyUsage(supabase, keyId);

      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Criar conta</CardTitle>
          <CardDescription>
            Preencha os dados para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="access-key">Chave de Acesso</Label>
                <Input
                  id="access-key"
                  type="text"
                  placeholder="Digite sua chave de acesso"
                  required
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repetir Senha</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Entrar
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
