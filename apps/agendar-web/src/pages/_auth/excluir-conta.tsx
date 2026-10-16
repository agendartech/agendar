import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { deleteAccount } from "@/http/partner/delete-account"

export const Route = createFileRoute("/_auth/excluir-conta")({
  component: DeleteAccount,
})

const deleteAccountSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um endereço de e-mail válido",
  }),
  password: z.string().min(1, { message: "Informe sua senha" }),
  confirm: z.boolean().refine(value => value, {
    message: "Confirme que entende que a exclusão é permanente",
  }),
})

type Inputs = z.infer<typeof deleteAccountSchema>

function Logo() {
  return (
    <a href="/" className="flex flex-col items-center gap-2 font-medium">
      <img
        src="/logo.jpg"
        alt="Logo Agendar"
        className="w-16 h-16 rounded-full object-cover border"
      />
      <span className="sr-only">Agendar</span>
    </a>
  )
}

function DeleteAccount() {
  const [deleted, setDeleted] = useState(false)

  const form = useForm<Inputs>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm: false,
    },
  })

  const { mutateAsync: removeAccount, isPending } = useMutation({
    mutationFn: (values: Inputs) =>
      deleteAccount(values.email.toLowerCase(), values.password),
  })

  async function onSubmit(values: Inputs) {
    await removeAccount(values)
    setDeleted(true)
  }

  if (deleted) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <Logo />
          <h1 className="text-xl font-bold">Conta excluída</h1>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Sua conta e todos os dados associados foram excluídos e a assinatura
          foi cancelada. Obrigado por ter usado o Agendar.
        </p>
        <div className="text-center text-sm">
          <Link to="/" className="underline underline-offset-4">
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <Logo />
        <h1 className="text-xl font-bold">Excluir conta</h1>
        <div className="text-center text-sm text-muted-foreground">
          Exclua sua conta do Agendar e todos os dados associados.
        </div>
      </div>

      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm space-y-2">
        <p>
          A exclusão é <strong>imediata e permanente</strong>. Serão apagados:
          conta, estabelecimentos, profissionais, serviços, clientes,
          agendamentos, pacotes e programas de fidelidade.
        </p>
        <p>A assinatura será cancelada na hora, sem novas cobranças.</p>
        <p className="text-muted-foreground">
          Também é possível excluir pelo aplicativo, em Configurações → Excluir
          conta. Profissionais devem pedir a exclusão ao proprietário do
          estabelecimento.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={checked => field.onChange(checked)}
                    />
                  </FormControl>
                  <FormLabel className="font-normal leading-snug">
                    Entendo que a exclusão é permanente e não pode ser desfeita.
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="destructive"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Excluir minha conta"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <Link to="/privacidade" className="underline underline-offset-4">
          Política de Privacidade
        </Link>
      </div>
    </div>
  )
}
