# Publicação Android (Google Play)

Registro do que foi feito para publicar o app mobile na Google Play, como
gerar e enviar novas versões e o que ainda falta. Textos da ficha, respostas
de Segurança dos dados e classificação ficam em [`lojas.md`](lojas.md).

## Situação (19/10/2026)

| Item | Estado |
|---|---|
| App na Play Console | Criado: "Agendar", pt-BR, App, Gratuito |
| Pacote | `br.tec.agendar` (definido no 1º upload, não muda mais) |
| Conta Google Play | **Pessoal, nova** → exige teste fechado antes da produção |
| Teste interno | Versão 5 (1.0.0) publicada |
| Teste fechado (Alpha) | Versão 4 enviada para revisão; promover a 5 |
| Produção | Bloqueada até cumprir os 12 testadores × 14 dias |
| Envio automático (`eas submit`) | Funcionando via conta de serviço |

### Regra dos 12 testadores

Contas pessoais criadas recentemente só liberam a produção depois de um teste
fechado com **pelo menos 12 testadores inscritos por 14 dias seguidos**.
Depois disso: Play Console → Painel → **Solicitar acesso à produção**.

## Builds

Gerados no EAS (projeto `dc3cceea-211d-4060-811c-4674385e6b23`, conta
`cesarsilvacofi`), perfil `production`, sempre a partir do `main`.

| versionCode | Build EAS | Observação |
|---|---|---|
| 2 | `8042bfac-3b6a-403f-9fad-794cbe453c3f` | Primeiro build; criou o keystore |
| 4 | `a588cf83-0ead-4a1c-9692-10327fca4acb` | Enviado manualmente (teste interno e fechado) |
| 5 | `9cb00f7d-4bae-4625-bf10-9e311f762802` | Versão final; enviado por `eas submit` |

`appVersionSource: remote` + `autoIncrement`: o EAS incrementa o versionCode a
cada build de produção.

### Assinatura

- **Keystore de upload** gerado no EAS no primeiro build. **Nunca regenerar**:
  a Play Console só aceita builds assinados com ele.
- **Play App Signing** ativado (a Google guarda a chave de assinatura final).

## Como publicar uma nova versão

```bash
# 1. a partir do main atualizado, em apps/agendar-mobile
eas build --platform android --profile production --non-interactive --no-wait

# 2. quando o build terminar
eas submit --platform android --profile production --id <BUILD_ID> --non-interactive
```

Na VPS, o `eas` roda pelo wrapper Docker `/root/.config/expo/eas.sh` (não há
Node no host).

O envio vai para a faixa definida em `eas.json` → `submit.production.android`:

```json
{
  "serviceAccountKeyPath": "./secrets/play-service-account.json",
  "track": "internal"
}
```

Quando a produção for liberada, trocar `track` para `"production"`. Para
mover uma versão entre faixas (interno → fechado → produção) sem novo envio:
Play Console → a faixa → **Promover versão**.

### Conta de serviço (envio automático)

- Projeto Google Cloud: `agendar-play`, com a **Google Play Android Developer
  API** ativada.
- Conta: `eas-submit@agendar-play.iam.gserviceaccount.com`, sem papéis no
  Cloud; convidada na Play Console (Usuários e permissões) com permissão de
  liberar versões em produção e faixas de teste.
- Chave JSON em `apps/agendar-mobile/secrets/play-service-account.json`
  (somente na VPS; a pasta `secrets/` está no `.gitignore`). Se a chave vazar,
  apagar no Google Cloud (conta → Chaves) e gerar outra.

## Ajustes feitos no app para a loja

- **Exclusão de conta** dentro do app (Configurações e tela "Nenhum plano
  ativo") e na web em `/excluir-conta`, a URL informada na Segurança dos dados.
- **Política de privacidade** em `https://agendar.tec.br/privacidade`.
- **Sem link para compra externa**: o botão "Ver planos" foi removido também no
  Android (política de pagamentos da Google Play). A assinatura é contratada
  só pelo site.
- **ID de publicidade**: o app não usa. Declarado "Não" na Play Console e a
  permissão `com.google.android.gms.permission.AD_ID` está em
  `blockedPermissions` no `app.config.ts`, para nenhuma biblioteca incluí-la.
- **Firebase de produção** (`google-services.json`), escolhido por
  `EXPO_PUBLIC_APP_VARIANT=production`.
- Câmera e microfone desativados; permissão de fotos com texto em português.

## Ficha da loja e formulários

- Textos, Segurança dos dados, classificação, público-alvo: [`lojas.md`](lojas.md).
- Ícone 512×512 e imagem de destaque 1024×500: `docs/lojas/`.
- Prints tirados no ambiente dev com a conta de revisão.

## Conta de revisão

`revisao@agendar.tec.br`, criada em **produção** e em **dev** (a senha está na
Play Console → Conteúdo do app → Acesso ao app). É um proprietário com
assinatura em trial longo no Stripe (~700 dias), salão "Studio Bella
Demonstração", 3 profissionais, 5 serviços, 8 clientes e agendamentos de 30
dias atrás até 45 dias à frente da data de criação. Se os agendamentos futuros
acabarem, os revisores ainda veem o histórico, mas vale recriar os dados.

## Pendências

1. Promover a versão 5 para o teste fechado.
2. Reunir 12+ testadores e aguardar 14 dias.
3. Solicitar acesso à produção.
4. Trocar `track` para `production` no `eas.json` e publicar.
5. Confirmar o e-mail de contato usado na política (`contato@agendar.com`).
6. Funcionários não têm exclusão de conta própria (a conta é do proprietário);
   a Google pode questionar.
