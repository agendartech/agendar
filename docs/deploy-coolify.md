# Deploy (Coolify)

Registro da infraestrutura de deploy da API e do Web em uma VPS com Coolify,
incluindo as decisões tomadas e as armadilhas encontradas.

Configurado em 11/09/2026. O app mobile não faz parte deste deploy.

## Infraestrutura

- **VPS**: `2.25.195.45` (Ubuntu)
- **Painel Coolify**: `http://2.25.195.45:8000` — v4.3.19
- **Projeto**: `agendar` (`m4zypo1i3myd5dffi3vxq2ne`)
- **Servidor**: `localhost` (`welny4nzyet0yxmvl3lgjt0k`) — o próprio host do Coolify

Dois ambientes, cada um com seu Postgres isolado:

| Ambiente | Branch | UUID do ambiente |
|---|---|---|
| `production` | `main` | `60hvav6ug91r6t5mhwojacb1` |
| `dev` | `dev` | `afyh35s6jjiam301r5zuidfv` |

### Recursos

| Recurso | Ambiente | URL | UUID |
|---|---|---|---|
| `agendar-web-prod` | production | https://agendar.tec.br | `utpj6wrgjz3vch22zf4yxnla` |
| `agendar-api-prod` | production | https://api.agendar.tec.br | `lso6uzw9v07w6bsarsr1jwgq` |
| `agendar-postgres` | production | interno | `uwkbh8pwpzofd0zlnwf5kbn6` |
| `agendar-web-dev` | dev | https://dev.agendar.tec.br | `cwewibmd8yriw3yx9ur6hsfu` |
| `agendar-api-dev` | dev | https://api.dev.agendar.tec.br | `qojwqezkz4ubr8vwpd1gvjch` |
| `agendar-postgres-dev` | dev | interno | `fjozsqzx451jopay03xbp2fl` |

Os Postgres **não** são expostos publicamente — as APIs os alcançam pela rede
interna do Docker, usando o UUID do banco como hostname.

### Build

Ambas as apps usam Build Pack **Dockerfile** (não Nixpacks):

| App | Base Directory | Porta exposta |
|---|---|---|
| API | `/apps/agendar-api` | 3333 |
| Web | `/apps/agendar-web` | 80 |

**Sem port mappings.** O acesso é sempre pelo proxy (Traefik) do Coolify via
domínio. Ver "Porta 8080 ocupada" abaixo.

### DNS

Gerenciado pela **Vercel** (`ns1/ns2.vercel-dns.com`), não pelo registrador.
Seis registros `A` apontam para `2.25.195.45`: `@`, `www`, `api`, `dev`,
`api.dev`, `coolify`.

Existe um wildcard `*.agendar.tec.br` apontando para a Vercel. Registros
específicos têm precedência, então ele não atrapalha — mas note que wildcard
cobre só um nível: `api.dev.agendar.tec.br` exige registro explícito.

O domínio também tem MX/SPF/DKIM da **Hostinger** para email. Não mexer.

TLS é emitido pelo Let's Encrypt no deploy. `www` redireciona para a raiz via
campo `redirect: non-www` da aplicação web de produção.

## Variáveis de ambiente

Valores ficam só no Coolify. Esta tabela documenta a origem de cada uma.

### APIs (`agendar-api-prod` e `agendar-api-dev`)

| Variável | Origem |
|---|---|
| `DATABASE_URL` | URL interna do Postgres do próprio ambiente |
| `JWT_SECRET` | aleatório, **diferente** em cada ambiente |
| `FRONTEND_URL` | `https://agendar.tec.br` / `https://dev.agendar.tec.br` |
| `NODE_ENV` | `production` nos dois |
| `CORS_ORIGINS` | só em prod: `https://www.agendar.tec.br` |
| `STRIPE_SECRET_KEY` | dashboard do Stripe |
| `STRIPE_WEBHOOK_SECRET` | retornado ao criar o endpoint de webhook |
| `FIREBASE_SERVICE_ACCOUNT_KEY_ENCODED_JSON` | service account em base64 |
| `RESEND_API_KEY` | Resend, escopo `sending_access` |
| `RESEND_EMAIL` | `noreply@agendar.tec.br` |

`FIREBASE_STORAGE_BUCKET` e `SUPPORT_EMAIL` são opcionais e não estão setadas.

O `env.ts` já injeta o `FRONTEND_URL` no CORS automaticamente; `CORS_ORIGINS`
é só para origens extras.

### Webs (`agendar-web-prod` e `agendar-web-dev`)

| Variável | Valor |
|---|---|
| `VITE_API_URL` | `https://api.agendar.tec.br` / `https://api.dev.agendar.tec.br` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | dashboard do Stripe |

**As duas são build-time.** Mudar qualquer uma exige *rebuild*, não restart.

## Serviços externos

- **Stripe**: conta em modo **sandbox** (`acct_1RcWSH...`). Endpoints de webhook
  em `https://api.agendar.tec.br/webhook/stripe` (`we_1UEWKo...`) e
  `https://api.dev.agendar.tec.br/webhook/stripe` (`we_1UEWKp...`), ambos com os
  5 eventos que `routes/subscription/stripe-webhook.ts` trata.
- **Firebase**: projeto `agendar-dev-3c6fc`, **compartilhado** entre prod e dev.
- **Resend**: domínio `agendar.tec.br` verificado, região `sa-east-1`.

## Armadilhas encontradas

Cada uma destas custou uma falha de deploy ou um bug silencioso.

### Alpine não funciona no build

O esbuild (usado por tsup e vite) falha no `bun install` em musl. Build e
runtime usam **Debian slim**. O `bcrypt@6` traz prebuilds para glibc e musl,
então nada compila — mas não tente "otimizar" voltando para Alpine.

### Migrations no boot, não no pre-deployment

O pre-deployment command do Coolify roda **dentro de um container já em
execução**. No primeiro deploy de uma app nova não existe container, e ele é
pulado com `No running containers found. Skipping` — silenciosamente. A API
subia com o banco vazio e todo endpoint que lê do DB retornava 500.

Por isso o `CMD` do Dockerfile da API é:

```
node dist/db/migrate.mjs && exec node dist/server.mjs
```

O `src/db/migrate.ts` é standalone de propósito: usa só `DATABASE_URL`, sem
depender do `drizzle-kit` (devDependency, ausente na imagem de produção) nem do
`env.ts` completo. O `drizzle.config.ts` não serve aqui porque importa `@/env`,
que exige todas as credenciais só para rodar uma migration.

### Porta 8080 ocupada no host

Algo no host já usa a 8080, o que derrubou um deploy com
`Bind for 0.0.0.0:8080 failed: port is already allocated`. Os port mappings
foram removidos de todas as apps — o proxy do Coolify resolve o acesso.

Bônus: com portas mapeadas o Coolify avisa
`Application has ports mapped to the host system, rolling update is not supported`.
Sem elas, o rolling update funciona.

### Firebase base64 malformado derruba o boot

`clients/firebase/index.ts` faz `JSON.parse(atob(...))` no topo do módulo. Se o
base64 não decodificar para JSON válido, a API entra em restart loop com
`app/invalid-credential`. Gere sempre com:

```
base64 -i service-account.json | tr -d '\n'
```

O `tr -d '\n'` é obrigatório: o `base64` do macOS quebra a saída em linhas.

### Secret do webhook Stripe só aparece uma vez

`POST /v1/webhook_endpoints` retorna o `whsec_` **apenas na criação**. Um
`retrieve` posterior não traz. Se perder, tem que recriar o endpoint.

### Stripe compartilhado entre prod e dev

`db/seed-plans.ts` **arquiva todos os produtos ativos da conta** antes de criar
os novos. Como prod e dev usam a mesma conta Stripe, rodar o seed em dev
arquivaria os preços que prod está usando, e checkout com preço arquivado
falha. Os dois ambientes não podem seedar a mesma conta — o certo é uma
sandbox separada para dev.

### SPF: um registro por domínio

O domínio já tem `v=spf1 include:_spf.mail.hostinger.com ~all`. Não criar um
segundo registro SPF (invalida os dois). Se o Resend pedir SPF, mesclar os
`include` ou verificar um subdomínio.

## Peculiaridades da API do Coolify (v4.3.19)

Descobertas na marra; a documentação não cobre bem.

| Situação | Comportamento |
|---|---|
| Criar env var | Campo é `is_buildtime`, **não** `is_build_time` — este último dá 422 |
| Default de env var | `is_buildtime` e `is_runtime` vêm `true` |
| Env var criada | Gera automaticamente uma cópia gêmea com `is_preview: true` |
| Disparar deploy | `POST /deploy?uuid=...` — o `GET` responde "endpoint has changed" |
| Criar ambiente | `POST /projects/{uuid}/environments`, aceita **só** `name` |
| Settings da instância | Não existe — o FQDN do painel só pela UI |
| Executar comando | Não existe `/execute`; use o Terminal da UI |

## Operação

**Deploy manual** (não há deploy automático — ver pendências):

```
curl -X POST -H "Authorization: Bearer $TOKEN" \
  "http://2.25.195.45:8000/api/v1/deploy?uuid=<app-uuid>&force=true"
```

**Trocar env var da API**: editar no Coolify e redeployar. Para o Web, lembrar
que `VITE_*` exige rebuild.

**Popular os planos**: pelo Terminal do Coolify, dentro do container da API,
`node dist/db/seed-plans.mjs` — lendo antes o aviso sobre Stripe compartilhado.

## Pendências

- **Painel acessado por IP** (decisão): `http://2.25.195.45:8000`, sem domínio
  e sem HTTPS. O registro `coolify.agendar.tec.br` existe no DNS mas não é
  usado. Consequência: o login no painel trafega sem TLS e a porta 8000 fica
  aberta. Para mudar, basta setar o FQDN em *Settings → Instance Settings* —
  não há endpoint na API para isso.
- **Sem deploy automático**: o repo `agendartech/agendar` é público, mas a conta
  usada não tem permissão de admin, então não foi possível criar o webhook nem
  instalar o GitHub App. Precisa de alguém com admin no repo.
- **Planos não populados**: `/plans` retorna `[]` nos dois ambientes.
- **Firebase compartilhado**: um agendamento criado em dev dispara push real nos
  aparelhos de produção, porque os tokens FCM vivem no mesmo projeto.
- **Swagger público**: `/docs` está aberto na internet em ambos os ambientes.
