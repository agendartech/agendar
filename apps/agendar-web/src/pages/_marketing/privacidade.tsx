import { createFileRoute, Link } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { Footer } from "./-components/footer"
import { MarketingHeader } from "./-components/marketing-header"

export const Route = createFileRoute("/_marketing/privacidade")({
  component: PrivacyPolicy,
})

const CONTACT_EMAIL = "contato@agendar.com"
const WHATSAPP_URL = "https://wa.me/5527992024223"
const LAST_UPDATED = "16 de outubro de 2026"

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  )
}

function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-svh w-full">
      <MarketingHeader />

      <main className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Política de Privacidade</h1>
          <p className="text-sm text-muted-foreground">
            Última atualização: {LAST_UPDATED}
          </p>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Esta política explica como o Agendar (site agendar.tec.br e
          aplicativos para Android e iOS) coleta, usa e protege dados pessoais,
          em conformidade com a Lei Geral de Proteção de Dados (Lei nº
          13.709/2018 — LGPD).
        </p>

        <Section title="1. Quem somos">
          <p>
            O Agendar é uma plataforma de gestão de agendamentos para
            estabelecimentos como salões de beleza, barbearias e clínicas. Em
            relação aos dados da conta do estabelecimento, o Agendar atua como
            controlador. Em relação aos dados dos clientes finais cadastrados
            pelo estabelecimento, o estabelecimento é o controlador e o Agendar
            atua como operador, tratando os dados em seu nome.
          </p>
        </Section>

        <Section title="2. Dados que coletamos">
          <p>
            <strong>Titular da conta (estabelecimento):</strong> nome, e-mail,
            senha (armazenada de forma criptografada), cidade, estado e dados do
            estabelecimento (nome, endereço, telefone, logo e horários de
            funcionamento).
          </p>
          <p>
            <strong>Profissionais:</strong> nome, e-mail, telefone, foto,
            biografia, serviços prestados, comissões e agenda, cadastrados pelo
            titular da conta.
          </p>
          <p>
            <strong>Clientes do estabelecimento:</strong> nome, telefone e,
            quando informados, e-mail, CPF, endereço e observações, além do
            histórico de agendamentos, pacotes e pontos de fidelidade.
          </p>
          <p>
            <strong>Imagens:</strong> fotos escolhidas da galeria do aparelho
            para logo, serviços, pacotes e profissionais. O aplicativo acessa
            apenas as imagens que você seleciona.
          </p>
          <p>
            <strong>Dados técnicos:</strong> token de notificação push do
            aparelho, usado para avisar sobre novos agendamentos.
          </p>
          <p>
            <strong>Pagamentos:</strong> os dados de cartão são informados
            diretamente ao Stripe, nosso processador de pagamentos. O Agendar
            não armazena números de cartão.
          </p>
          <p>
            Não usamos ferramentas de publicidade nem de rastreamento entre
            aplicativos e sites, e não vendemos dados pessoais.
          </p>
        </Section>

        <Section title="3. Como usamos os dados">
          <ul className="list-disc pl-6 space-y-1">
            <li>Criar e manter a conta e autenticar o acesso;</li>
            <li>
              Permitir o agendamento de serviços, a gestão da agenda,
              profissionais, clientes, pacotes e programas de fidelidade;
            </li>
            <li>
              Enviar notificações de novos agendamentos e mensagens de
              confirmação por WhatsApp e e-mail;
            </li>
            <li>Processar a assinatura do plano contratado;</li>
            <li>Prestar suporte e cumprir obrigações legais.</li>
          </ul>
          <p>
            As bases legais são a execução de contrato, o cumprimento de
            obrigação legal e o legítimo interesse, conforme o art. 7º da LGPD.
          </p>
        </Section>

        <Section title="4. Compartilhamento">
          <p>
            Compartilhamos dados somente com fornecedores necessários para o
            funcionamento do serviço:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Stripe — processamento de pagamentos e assinaturas;</li>
            <li>
              Google Firebase — notificações push e armazenamento de imagens;
            </li>
            <li>Resend — envio de e-mails transacionais;</li>
            <li>Z-API — envio de mensagens por WhatsApp;</li>
            <li>Provedor de hospedagem dos servidores e do banco de dados.</li>
          </ul>
          <p>
            Alguns desses fornecedores podem tratar dados fora do Brasil, com as
            salvaguardas previstas na LGPD.
          </p>
        </Section>

        <Section title="5. Armazenamento e segurança">
          <p>
            Os dados ficam armazenados enquanto a conta estiver ativa. Usamos
            conexão criptografada (HTTPS), senhas com hash e controle de acesso
            por perfil (proprietário e profissional).
          </p>
        </Section>

        <Section title="6. Exclusão da conta e dos dados">
          <p>
            O titular da conta pode excluir a conta a qualquer momento pelo
            aplicativo, em <strong>Configurações → Excluir conta</strong>, ou
            pela página{" "}
            <Link to="/excluir-conta" className="underline text-foreground">
              agendar.tec.br/excluir-conta
            </Link>
            .
          </p>
          <p>
            A exclusão é imediata e permanente: apaga a conta, os
            estabelecimentos, profissionais, serviços, clientes e agendamentos,
            e cancela a assinatura sem novas cobranças. Registros de pagamento
            podem ser mantidos pelo Stripe pelo prazo exigido pela legislação
            fiscal.
          </p>
          <p>
            Profissionais e clientes finais podem solicitar a exclusão dos seus
            dados ao estabelecimento ou diretamente ao Agendar pelos canais
            abaixo.
          </p>
        </Section>

        <Section title="7. Seus direitos">
          <p>
            Você pode solicitar confirmação, acesso, correção, portabilidade,
            anonimização ou exclusão dos seus dados, além de informações sobre o
            compartilhamento, conforme o art. 18 da LGPD.
          </p>
        </Section>

        <Section title="8. Crianças">
          <p>
            O Agendar é destinado a estabelecimentos e não é direcionado a
            menores de 18 anos.
          </p>
        </Section>

        <Section title="9. Contato">
          <p>
            E-mail:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline text-foreground"
            >
              {CONTACT_EMAIL}
            </a>
            <br />
            WhatsApp:{" "}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-foreground"
            >
              (27) 99202-4223
            </a>
          </p>
          <p>
            Esta política pode ser atualizada. A data da última atualização fica
            no topo desta página.
          </p>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
