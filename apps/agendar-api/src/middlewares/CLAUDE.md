# Middlewares

Middlewares de autenticação e autorização.

## auth.ts (Partner Auth)

Autenticação de proprietários/partners via JWT.

### Métodos adicionados ao request:

```typescript
request.getCurrentPartnerId(): Promise<string>
// Extrai partnerId do JWT (campo 'sub')
// Para employee: só em EMPLOYEE_ALLOWED_ROUTES, retornando o dono da filial
// Tokens sem role são tratados como partner (backward compat)
// Throws UnauthorizedError se token inválido

request.getCurrentEstablishmentId(): Promise<{ establishmentId: string, partnerId: string, employeeId?: string }>
// 1. Obtém partnerId do token
// 2. Se employee: retorna a filial do token + employeeId (ignora o header)
// 3. Se header 'x-establishment-id' presente:
//    - Valida se partner é dono do establishment
//    - Throws ForbiddenError se não for
// 4. Se header ausente:
//    - Retorna primeiro establishment do partner
```

**Importante**: employees só acessam as rotas de `EMPLOYEE_ALLOWED_ROUTES`. Rotas dessa lista que tocam agendamentos devem filtrar pelo `employeeId` retornado. A checagem só roda se o handler chamar `getCurrentPartnerId()` ou `getCurrentEstablishmentId()`.

## employee-auth.ts (Employee Auth)

Autenticação de funcionários/profissionais via JWT.

### Métodos adicionados ao request:

```typescript
request.getCurrentEmployeeId(): Promise<string>
// Extrai employeeId do JWT (campo 'sub')
// Verifica que role === "employee"
// Throws ForbiddenError se não for employee

request.getCurrentEmployeeEstablishmentId(): Promise<{ employeeId: string, establishmentId: string }>
// Extrai employeeId e establishmentId do JWT
// establishmentId está embutido no token (employee pertence a 1 establishment)
```

## customer-auth.ts (Customer Auth)

Autenticação de clientes via headers (sem JWT).

### Headers esperados:
```
x-customer-phone: string
x-establishment-id: string
```

### Método adicionado:
```typescript
request.getCurrentCustomerEstablishmentId(): Promise<{ customerId: string, establishmentId: string }>
// Busca customer por phone + establishmentId
```

## admin-auth.ts (Admin Auth)

Autenticação de administradores do sistema.

## require-active-subscription.ts

Validação de assinatura ativa.

### Lógica:
1. Obtém partnerId do token
2. Busca subscription mais recente do partner
3. Verifica:
   - `status === "active"` ou `status === "trialing"`
   - `currentPeriodEnd > now`
4. Throws ForbiddenError se inválido

### Bypass em desenvolvimento:
```typescript
if (env.NODE_ENV === "development") return // Skip validation
```

## Uso nos Plugins

```typescript
// Registrar middleware no plugin
typedApp.register(auth)
typedApp.register(requireActiveSubscription)

// Usar métodos no handler
const { establishmentId } = await request.getCurrentEstablishmentId()
```
