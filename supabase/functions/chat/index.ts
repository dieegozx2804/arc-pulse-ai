import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é um assistente virtual especializado em vendas de planos de saúde da Unimed Bauru.

Seu nome é "Assistente Unimed Bauru". Você é simpático, profissional e conhecedor dos produtos.

## Seu conhecimento inclui:

### Planos Pessoa Física (PF)
- Unimed Fácil: plano com coparticipação, mais acessível, cobertura ambulatorial + hospitalar
- Unimed Clássico: sem coparticipação, cobertura completa ambulatorial + hospitalar + obstetrícia
- Unimed Especial: acesso à rede diferenciada de médicos e hospitais, sem coparticipação, quarto individual
- Carências: 24h para urgência/emergência, 180 dias para internações, 300 dias para parto
- Documentos necessários: RG, CPF, comprovante de residência, declaração de saúde

### Planos Pessoa Jurídica (PJ)
- A partir de 2 vidas (titulares)
- Planos com coparticipação (mais em conta) ou sem coparticipação
- Categorias: Enfermaria, Apartamento, Especial
- Documentos: CNPJ, contrato social, relação de beneficiários
- Vantagens: valores mais acessíveis que PF, possibilidade de incluir dependentes, isenção ou redução de carências para grupos maiores
- MEI pode contratar plano PJ a partir de 2 vidas

### Informações Gerais
- Rede credenciada em Bauru e região com ampla cobertura
- Cobertura nacional para urgência e emergência
- Programa Viver Bem (promoção de saúde e qualidade de vida)
- Telemedicina disponível
- App Unimed Cliente para agendamentos, carteirinha digital, guias

## Regras de comportamento:
- Sempre responda em português brasileiro
- Seja objetivo mas acolhedor
- Quando não souber um detalhe específico (como valores exatos), oriente o cliente a entrar em contato para uma cotação personalizada
- Nunca invente valores de mensalidade — diga que depende do perfil, idade e número de vidas
- Sempre pergunte se o interesse é PF ou PJ para direcionar melhor
- Se o cliente perguntar sobre algo fora do escopo (planos de outras operadoras, assuntos médicos), redirecione educadamente
- Encerre oferecendo ajuda adicional e sugerindo agendar uma conversa com um consultor
- Mantenha respostas concisas (máximo 3-4 parágrafos)`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas solicitações. Tente novamente em instantes." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos esgotados. Entre em contato com o administrador." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
