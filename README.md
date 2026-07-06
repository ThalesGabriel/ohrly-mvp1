# Ohrly — Landing pós-checklist para e-commerce

Projeto Next.js criado para receber pessoas que baixaram o **Checklist de Desempenho Invisível para E-commerce** e querem entender como o Ohrly pode ajudar na operação da loja.

## O que mudou

- A home (`/[locale]`) agora usa a mesma narrativa da campanha/checklist.
- Nova rota `/{locale}/ecommerce` com a página ponte pós-checklist.
- Tema claro + roxo, compatível com a tela de onboarding/checklist.
- Header ajustado para campanha: Checklist, Estudos, Diagnóstico e CTA de versão inicial.
- PDF do checklist em `public/materials/checklist_desempenho_invisivel_ecommerce_ohrly.pdf`.
- API opcional `POST /api/ecommerce-interest` para salvar interesse no Supabase.

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse:

```txt
http://localhost:3000/pt/ecommerce
```

## Captura de interesse no Supabase

A API usa a tabela `ecommerce_onboarding_responses`, criada no fluxo anterior.

Configure as variáveis:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Se as variáveis não existirem, o endpoint responde com sucesso em modo fallback para facilitar testes locais sem banco.

## Página recomendada para campanha/e-book

Use `/pt/ecommerce` como destino para quem clicou em “saber mais” dentro do e-book.

A landing foi desenhada para continuar a conversa:

1. checklist ajuda a perceber sinais;
2. Ohrly transforma sinais em leitura;
3. versão inicial valida aderência antes de pedir dados reais.
