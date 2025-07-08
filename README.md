# Trabalho de Sistemas Distribuidos

**A dor que o projeto resolve**

O desperdício de alimentos é uma das maiores contradições da sociedade contemporânea. Enquanto milhões de pessoas vivem em situação de insegurança alimentar, toneladas de alimentos perfeitamente consumíveis são descartadas diariamente, principalmente no varejo alimentar, como supermercados. Esse desperdício impacta financeiramente os estabelecimentos, sobrecarrega o meio ambiente e ignora o potencial de impacto social positivo que a redistribuição dos alimentos poderia gerar.

Em supermercados, esse problema é agravado por falhas de gestão de estoque e pela ausência de sistemas automatizados de monitoramento de validade. Muitos estabelecimentos ainda realizam esse processo de forma manual ou reativa, o que reduz drasticamente a capacidade de agir com antecedência. Produtos que poderiam ser promovidos, remanejados ou doados acabam sendo descartados por falta de planejamento, tempo ou informação acessível.

Além disso, segundo o artigo “Prevenção do Desperdício de Alimentos no Setor Supermercadista” (Revista do Caderno Acadêmico UNIFAGOC, 2022), supermercados representam um elo crucial entre indústria e consumidor. O estudo destaca que as perdas nos supermercados geralmente ocorrem por vencimento de prazo e má manipulação de produtos, e propõe o uso de tecnologias baseadas em inteligência artificial como solução promissora para monitoramento e tomada de decisão automatizada, reduzindo o desperdício e aumentando a eficiência operacional.

Portanto, a dor que o projeto resolve é dupla:

Operacional: A falta de um sistema inteligente de controle de validade leva a perdas financeiras e má reputação.
Social e ambiental: O descarte de alimentos ainda em condições de consumo agrava problemas sociais e gera impactos ambientais evitáveis.


**Relevância do problema**

Diversas organizações já destacam a urgência de soluções tecnológicas para o desperdício de alimentos:

- Segundo a FAO (Organização das Nações Unidas para Agricultura e Alimentação), cerca de 1,3 bilhão de toneladas de alimentos são desperdiçadas por ano no mundo, sendo uma parte significativa no varejo e supermercados.
- No Brasil, estima-se que até 30% dos alimentos perecíveis são desperdiçados antes de chegar ao consumidor final, segundo estudo da EMBRAPA.
- O desperdício em supermercados pode chegar a 20% das perdas totais, e poderia ser mitigado com ações de monitoramento e planejamento inteligente (ABRAS - Associação Brasileira de Supermercados).
- A Lei nº 14.016/2020, conhecida como Lei de Combate ao Desperdício de Alimentos, incentiva a doação de alimentos próximos ao vencimento em condições seguras, reforçando a importância de identificar esses produtos a tempo.

**Referências**

FAO: https://www.fao.org/sustainable-development-goals/news/detail-news/en/c/1275712/

EMBRAPA: https://www.embrapa.br/busca-de-noticias/-/noticia/50192502

ABRAS: https://abras.com.br

UNIFAGOC (2022): Prevenção do desperdício de alimentos no setor supermercadista https://revista.unifagoc.edu.br/caderno/article/view/956?

# Visão Arquitetônica Inicial (Pré-modelagem de Ameaças)

## Objetivo
Descrever a estrutura inicial do sistema distribuído baseado em agentes, antes da análise de ameaças e aplicação de mitigação.

## Componentes
- **Usuário**: cliente externo que envia requisições HTTP
- **Validade Agent** (`porta 5000`): responsável por cadastrar produtos e avaliar riscos usando modelo LLM (via Ollama)
- **Recomendação Agent** (`porta 5001`): consome avaliações do Validade Agent e gera sugestões
- **Ollama (LLM Server)**: modelo local acessado por ambos os agentes via HTTP

## Comunicação A2A
```
[Usuário]
   |
   | POST /produtos, GET /alertas
   v
[Validade Agent] -----> [Ollama local]
   |
   | GET /alertas
   v
[Recomendação Agent] -----> [Ollama local]
```

## Falhas de Segurança Identificadas (ainda não mitigadas)
- Sem autenticação entre agentes, em endpoints.
- Risco de injeção e falhas por payloads inesperados
- Logs com estruturas circulares ou dados sensíveis.

# Visão Arquitetônica Final (Pós-modelagem de Ameaças)

## Mudanças aplicadas após identificação de riscos

| Ameaça identificada                        | Impacto | Mitigação aplicada                                  |
|-------------------------------------------|---------|------------------------------------------------------|
| Payload malicioso (injeção)               | Alto    | Validação estrita de campos obrigatórios             |
| Logs simplificados                        | Médio   | Logs simplificados, evitando vazamento de informações sensíveis e problemas com dados circulares em logs. |
| Falta de autenticação entre agentes      | Alto    | Uso de token estático ou JWT para autorização        |

## Novo Diagrama de Comunicação
```
[Usuário]
   |
   | POST /produtos (validação + limites)
   v
[Validade Agent] --(token)---> [Ollama (restrito)]
   |
   | GET /alertas (com header Authorization)
   v
[Recomendação Agent] --(token)---> [Ollama (restrito)]
```

## Boas práticas implementadas
- Comunicação controlada via headers de autenticação
- Validação de entrada robusta nos endpoints
- Logs otimizados e sem vazamento de estruturas circulares
- Possibilidade de expansão para autenticação com JWT real

## Status
✅ Arquitetura segura e modularizada, apta para containerização e escalabilidade.
