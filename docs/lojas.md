# Publicação nas lojas (Google Play e App Store)

Material para preencher a Play Console e o App Store Connect. App:
`br.tec.agendar` (Android e iOS), nome "Agendar".

Como gerar e enviar versões Android e o status da Google Play:
[`publicacao-android.md`](publicacao-android.md).

## URLs

| Campo | URL |
|---|---|
| Política de privacidade | https://agendar.tec.br/privacidade |
| Exclusão de conta (Google Play → Segurança dos dados) | https://agendar.tec.br/excluir-conta |
| Site / marketing | https://agendar.tec.br |
| Suporte | https://wa.me/5527992024223 |

## Ficha da loja

**Nome:** Agendar

**Subtítulo (Apple, até 30):** Agenda para salões e clínicas

**Descrição curta (Google, até 80):**
Agenda, clientes, profissionais e relatórios do seu salão na palma da mão.

**Palavras-chave (Apple, até 100, separadas por vírgula):**
agenda,agendamento,salão,barbearia,clínica,estética,manicure,comissão,clientes,horários

**Categoria:** Negócios (secundária na Apple: Produtividade)

**Descrição longa:**

```
O Agendar é o app de gestão para salões de beleza, barbearias, clínicas de estética e outros negócios que trabalham com horário marcado.

Com ele, o proprietário acompanha a agenda do dia, cadastra serviços e profissionais e vê o faturamento em tempo real. Os clientes agendam sozinhos pelo link do estabelecimento, e você recebe uma notificação a cada novo horário.

AGENDA
• Visualize os agendamentos do dia por profissional
• Faça check-in e conclua atendimentos
• Cancele horários informando o motivo
• Receba notificações de novos agendamentos

ESTABELECIMENTO
• Serviços com preço, duração e comissão por profissional
• Profissionais com horários, bloqueios e serviços que atendem
• Cadastro de clientes com histórico
• Pacotes de serviços e programa de fidelidade
• Horário de funcionamento e link público para agendamento online

RELATÓRIOS
• Faturamento, atendimentos e ticket médio
• Comissões por profissional
• Filtros por período

PARA OS PROFISSIONAIS
Cada profissional tem seu próprio acesso, com a agenda e os ganhos dele — sem ver o faturamento do estabelecimento.

O Agendar funciona com assinatura, contratada no site agendar.tec.br.
```

**Novidades desta versão:**
Primeira versão do Agendar nas lojas.

## Conta para revisão

Os revisores precisam de um login de **proprietário com assinatura ativa** e
dados de exemplo (serviços, profissionais, agendamentos). Informar e-mail e
senha em:
- Google: Conteúdo do app → Acesso ao app
- Apple: Informações para revisão do app → Informações de login

Notas para o revisor (Apple):

```
O Agendar é uma ferramenta de gestão para estabelecimentos (B2B). A assinatura é contratada pela empresa no site; o app não vende conteúdo digital nem assinaturas. A exclusão de conta fica em Configurações → Excluir conta.
```

## Google Play — Segurança dos dados

- Coleta ou compartilha dados? **Sim**
- Dados criptografados em trânsito? **Sim**
- Usuário pode pedir exclusão? **Sim** — URL: https://agendar.tec.br/excluir-conta

| Tipo de dado | Coletado | Compartilhado | Opcional | Finalidade |
|---|---|---|---|---|
| Informações pessoais → Nome | Sim | Não | Não | Funcionalidade do app, Gerenciamento da conta |
| Informações pessoais → E-mail | Sim | Não | Não | Funcionalidade do app, Gerenciamento da conta, Comunicações do desenvolvedor |
| Informações pessoais → Telefone | Sim | Não | Sim | Funcionalidade do app |
| Informações pessoais → Endereço | Sim | Não | Sim | Funcionalidade do app |
| Informações pessoais → Outras (CPF de clientes) | Sim | Não | Sim | Funcionalidade do app |
| Fotos e vídeos → Fotos | Sim | Não | Sim | Funcionalidade do app |
| Informações financeiras → Histórico de compras | Sim | Não | Não | Funcionalidade do app (valores de atendimentos) |
| IDs do dispositivo ou outros IDs (token push) | Sim | Não | Não | Funcionalidade do app |

Observações: pagamentos de assinatura são feitos no site pelo Stripe (o app não
coleta cartão). Provedores que tratam dados em nosso nome (Firebase, Stripe,
Resend, Z-API) **não** contam como "compartilhamento" para o Google.

**Classificação de conteúdo (IARC):** categoria "Utilitário, produtividade,
comunicação ou outro"; responder **Não** a violência, sexo, linguagem, drogas,
jogos de azar; interação entre usuários: **Não**; compartilha localização: **Não**.
Resultado esperado: Livre.

**Público-alvo:** 18 anos ou mais. **Anúncios:** Não. **App de notícias:** Não.
**Apps governamentais / saúde / financeiros:** Não.

## App Store — Privacidade do app

Rastreamento (tracking): **Não**. Todos os dados abaixo são **vinculados à
identidade** do usuário e usados apenas para **Funcionalidade do app**:

- Informações de contato: Nome, E-mail, Telefone, Endereço físico
- Conteúdo do usuário: Fotos, Outro conteúdo do usuário (observações de clientes)
- Identificadores: ID do usuário
- Compras: Histórico de compras (valores de atendimentos)

**Classificação etária:** responder "Nenhum" a todos os itens → 4+.
**Criptografia (Export Compliance):** usa apenas HTTPS padrão →
`ITSAppUsesNonExemptEncryption = false`.

## Screenshots

Imagens prontas em `docs/lojas/`: `icone-512.png` (ícone Google Play
512×512) e `destaque-1024x500.png` (imagem de destaque Google Play).


- Google: mínimo 2 capturas de telefone (proporção 16:9 ou 9:16) + ícone
  512×512 + imagem de destaque 1024×500.
- Apple: iPhone 6,9" (1320×2868) ou 6,7" (1290×2796). O app não suporta iPad
  (`supportsTablet: false`), então não precisa de capturas de iPad.

Telas sugeridas: Agenda do dia, Relatórios, Profissionais, Serviços, Clientes,
Detalhe do agendamento.

## Resposta à Apple — Guideline 2.1 (Information Needed)

Recusa recebida em 11/2026 pedindo vídeo, descrição e credenciais. Texto para
o campo **Notes** de *App Review Information* (limite de 4000 caracteres).
Trocar os `<...>` antes de enviar.

```
1. SCREEN RECORDING
<link do vídeo: YouTube não listado ou Google Drive com acesso público>
Recorded on <modelo do iPhone>, iOS <versão>. It starts at app launch and shows: login as owner, daily agenda, check-in and completing an appointment, cancelling an appointment, managing services/professionals/customers, reports, logout, login as a professional (employee view), and account deletion (Settings > Excluir conta).

2. PURPOSE AND AUDIENCE
Agendar is a management tool for appointment-based businesses in Brazil (beauty salons, barbershops, aesthetic clinics). Business owners use it to manage their daily agenda, services, professionals, customers, service packages, loyalty programs and revenue reports. Their customers book online through the business's public web page, and the owner receives a push notification for each new booking. It replaces paper agendas and WhatsApp-only scheduling, reducing no-shows and making commission calculation automatic. The app is open to any business in Brazil; it is not limited to a specific company.

3. HOW TO ACCESS
The app has two account types. Both demo accounts below have sample data.
- Owner (full access): <email> / <senha>
- Professional (sees only own agenda and earnings): <email> / <senha>
Steps: open the app, log in with the owner account. Agenda tab: view, check in, complete or cancel appointments. Loja tab: services, professionals, customers, packages, loyalty, business hours. Relatórios tab: revenue and commissions. Configurações tab: privacy policy, support and "Excluir conta" (account deletion, permanent).
Owner accounts are created and subscribed on our website (agendar.tec.br). The iOS app does not offer registration, does not sell or link to any purchase and contains no paid digital content; it is a companion app for an existing business account (B2B SaaS). Professional accounts are created by the owner inside the app.
There is no user-generated content shared between users, so no reporting/blocking is needed.

4. EXTERNAL SERVICES
- Own backend API (agendar.tec.br) with email/password authentication (JWT)
- Firebase Cloud Messaging (push notifications) and Firebase Storage (images)
- Resend (transactional email)
- Stripe (subscription billing on the website only; not used in the app)
- Z-API (WhatsApp booking confirmations sent to end customers)

5. REGIONAL DIFFERENCES
The app is in Brazilian Portuguese and prices are in BRL. Features and content are the same in every region.

6. REGULATED INDUSTRY
Not applicable. The app does not operate in a regulated industry and contains no protected third-party material.
```
