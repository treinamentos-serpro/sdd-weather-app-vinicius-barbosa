# Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa necessita de uma aplicação de previsão do tempo que permita aos usuários consultar as condições meteorológicas de cidades de seu interesse.

O produto deverá oferecer uma experiência simples, responsiva e acessível, com foco em:

- Busca de cidades.
- Visualização do clima atual.
- Consulta da previsão para os próximos cinco dias.
- Alternância entre Celsius e Fahrenheit.
- Uso adequado em dispositivos móveis.

A aplicação dependerá de um serviço externo de dados meteorológicos e deverá lidar com estados de carregamento, ausência de resultados e falhas de comunicação.

## Personas

| Persona | Objetivo principal | Contexto de uso | Métrica de sucesso do ponto de vista da persona |
|---|---|---|---|
| **Viajante que planeja a semana** | Consultar a previsão de cinco dias para escolher datas, destinos e atividades com menor risco de chuva ou condições adversas. | Usa principalmente desktop ou tablet, em casa, durante o planejamento da viagem; pode consultar novamente pelo celular durante o deslocamento. | Consegue comparar rapidamente os cinco dias da previsão e escolher uma data ou atividade sem precisar consultar outra fonte. |
| **Pessoa decidindo a roupa do dia** | Ver rapidamente o clima atual, a temperatura e a sensação térmica antes de sair de casa. | Usa principalmente o celular, pela manhã ou antes de sair, com pouco tempo e atenção disponível. | Obtém a informação necessária em poucos segundos e decide o que vestir sem navegar por telas complexas. |
| **Profissional que trabalha ao ar livre** | Acompanhar temperatura, chuva e vento para planejar atividades e ajustar sua rotina diária. | Usa principalmente o celular em campo, possivelmente sob luz intensa, conexão instável e durante pausas curtas; pode usar desktop para planejar o dia. | Consulta dados atualizados da cidade de trabalho e consegue decidir se mantém, adapta ou adia uma atividade. |

## Decisões

| Decisão | Justificativa | Perguntas em aberto resolvidas |
|---|---|---|
| **Fonte de dados: Open-Meteo** | A Open-Meteo oferece dados de geocodificação e previsão meteorológica sem exigir API key, reduzindo a complexidade de configuração e os riscos de exposição de credenciais no cliente. | Define o serviço meteorológico inicial (pergunta 1) e reduz a incerteza sobre autenticação e custos iniciais do provedor (pergunta 13). |
| **Período de previsão: hoje + 4 dias** | Padroniza o significado de “previsão de 5 dias” como o dia atual mais os quatro dias seguintes, alinhando a expectativa do usuário ao conteúdo exibido. | Resolve a ambiguidade do briefing sobre a inclusão do dia atual e orienta o detalhamento da previsão (pergunta 8). |
| **Unidade padrão: Celsius (°C)** | Celsius é a unidade mais adequada para a primeira versão direcionada a usuários de pt-BR. Fahrenheit continuará disponível por meio do controle de alternância. | Resolve a definição da unidade padrão (pergunta 5); a persistência da preferência (pergunta 6) permanece em aberto. |
| **Sem autenticação e sem persistência de servidor** | O MVP deve permitir consultas imediatas, sem cadastro, banco de dados ou gestão de contas. Preferências e dados temporários, se necessários, poderão ser tratados localmente no dispositivo. | Resolve a necessidade de autenticação (pergunta 2) e estabelece uma restrição para decisões futuras sobre histórico e favoritos (pergunta 12). |
| **Idioma da interface: pt-BR** | Concentrar a primeira versão em um único idioma reduz o escopo inicial e garante consistência de textos, datas e mensagens para o público prioritário. | Resolve a definição do idioma da interface (pergunta 14); o formato de data e o fuso horário ainda precisam ser detalhados. |

## Requisitos Funcionais

### RF01 — Buscar cidades

O sistema deve permitir que o usuário informe o nome de uma cidade para pesquisa.

A busca deve:

- Aceitar entrada textual.
- Apresentar cidades correspondentes ao termo informado.
- Exibir informações suficientes para diferenciar cidades com o mesmo nome, como país ou região.
- Permitir selecionar uma cidade para consultar seus dados meteorológicos.
- Informar quando nenhum resultado for encontrado.

### RF02 — Visualizar clima atual

Após selecionar uma cidade, o sistema deve exibir:

- Nome da cidade e localização.
- Temperatura atual.
- Unidade de temperatura selecionada.
- Condição climática atual.
- Ícone ou representação visual da condição climática.
- Informações complementares disponíveis, como sensação térmica, umidade e velocidade do vento.

### RF03 — Visualizar previsão de cinco dias

O sistema deve apresentar a previsão meteorológica dos cinco dias seguintes, contendo, no mínimo:

- Data ou dia da semana.
- Temperatura mínima.
- Temperatura máxima.
- Condição climática.
- Ícone ou representação visual da condição climática.

### RF04 — Alternar unidade de temperatura

O usuário deve poder alternar entre:

- Celsius (°C).
- Fahrenheit (°F).

A unidade escolhida deve ser aplicada ao clima atual e à previsão de cinco dias.

### RF05 — Indicar estados da aplicação

O sistema deve informar claramente ao usuário quando estiver:

- Carregando resultados.
- Sem cidade selecionada.
- Sem resultados para a busca.
- Com erro ao consultar o serviço meteorológico.
- Sem dados meteorológicos disponíveis.

### RF06 — Atualizar dados meteorológicos

O sistema deve permitir uma nova consulta dos dados meteorológicos da cidade selecionada, seja por ação explícita do usuário ou por outro mecanismo definido posteriormente.

## Requisitos Não-Funcionais

### RNF01 — Responsividade

A aplicação deve funcionar adequadamente em dispositivos móveis, tablets e desktops, sem perda de conteúdo ou funcionalidade, rolagem horizontal ou sobreposição de conteúdo.

O layout deve ser validado, no mínimo, nas larguras de 320 px, 768 px, 1024 px e 1440 px.

### RNF02 — Usabilidade

A busca e a visualização das informações principais devem ser compreensíveis sem treinamento prévio, com hierarquia visual clara e feedback imediato para as ações do usuário.

### RNF03 — Acessibilidade

A aplicação deve:

- Utilizar HTML semântico.
- Possuir contraste suficiente entre texto e fundo, sem depender exclusivamente de cor para comunicar informações.
- Disponibilizar labels, nomes acessíveis e mensagens compreensíveis para controles e tecnologias assistivas.
- Permitir navegação completa por teclado.
- Manter o foco visível e associar mensagens de erro aos controles correspondentes.

A aplicação deve atender, no mínimo, ao nível AA das WCAG 2.1 ou versão posterior adotada pelo projeto.

### RNF04 — Desempenho

A aplicação deve apresentar feedback visual imediatamente após o início de uma consulta e evitar requisições desnecessárias ao serviço externo.

Em condições normais de rede, a busca de cidades e a consulta meteorológica devem apresentar uma resposta inicial em até 2 segundos. As requisições devem possuir timeout definido e informar o usuário quando uma rede lenta ou indisponível impedir a conclusão.

### RNF05 — Disponibilidade e resiliência

Falhas temporárias, indisponibilidade do serviço externo ou respostas inválidas não devem fazer a interface travar. O usuário deve receber uma mensagem orientativa.

A aplicação deve buscar uma disponibilidade mensal mínima de 99,5%, desconsiderando manutenções programadas. A indisponibilidade da API externa deve ser tratada sem quebrar a interface.

### RNF06 — Compatibilidade

A aplicação deve oferecer suporte às versões atuais do Chrome, Firefox, Safari e Edge em dispositivos móveis e desktops.

### RNF07 — Segurança e privacidade

A aplicação não deve solicitar dados pessoais desnecessários. Toda comunicação com serviços externos deve utilizar HTTPS, e credenciais ou chaves privadas não devem ser expostas no cliente.

### RNF08 — Internacionalização

O produto deve definir idioma, formato de data, formato numérico e unidade padrão. A primeira versão deve, no mínimo, ter comportamento consistente em pt-BR.

### RNF09 — Cache e resiliência de dados

Quando possível, a aplicação deve manter em cache a última consulta meteorológica válida e permitir sua visualização caso uma nova consulta falhe. Os dados armazenados devem ser identificados como potencialmente desatualizados.

### RNF10 — Observabilidade

Falhas de busca, erros do serviço meteorológico e tempos de resposta devem ser registrados de forma suficiente para diagnóstico, sem armazenar dados pessoais desnecessários.

## Riscos

| ID | Risco | Tipo | Probabilidade | Impacto | Mitigação | Responsável | Status |
|---|---|---|---|---|---|---|---|
| R01 | Indisponibilidade ou instabilidade da API meteorológica | Técnico | Alta | Alto | Implementar timeout, tratamento de erros, mensagens orientativas, cache da última consulta válida e monitoramento dos limites de uso. | A definir | Aberto |
| R02 | Seleção incorreta de cidades homônimas | Produto | Média | Alto | Exibir país, região e outros identificadores geográficos nos resultados antes da seleção. | Product Manager | Aberto |
| R03 | Dados meteorológicos incompletos ou inválidos | Técnico | Média | Alto | Definir contrato mínimo de dados, validar respostas e exibir apenas informações disponíveis. | Frontend/Backend | Aberto |
| R04 | Experiência inadequada em telas pequenas | Técnico/Produto | Média | Alto | Adotar abordagem mobile-first e validar o layout nas larguras de 320 px, 768 px, 1024 px e 1440 px. | UX/Frontend | Aberto |
| R05 | Interpretação incorreta de datas, horários ou fusos | Produto/Técnico | Média | Alto | Utilizar o fuso horário da cidade consultada e definir formato de data e hora nos critérios de aceite. | Product Manager/Frontend | Aberto |
| R06 | Conversão incorreta entre Celsius e Fahrenheit | Técnico | Média | Médio | Centralizar a conversão, testar fórmulas, valores extremos e números decimais. | Frontend | Aberto |
| R07 | Dependência de conectividade ou redes lentas | Técnico/Produto | Alta | Médio | Exibir estados de carregamento e erro, evitar bloqueio da interface e avaliar cache dos últimos dados consultados. | Frontend | Aberto |

## Perguntas em Aberto

1. Qual serviço ou API meteorológica será utilizado?
2. A aplicação exigirá autenticação?
3. A busca deverá aceitar apenas cidades ou também coordenadas, CEPs e localização atual do dispositivo?
4. O sistema deverá solicitar permissão para usar a geolocalização do usuário?
5. Qual unidade deve ser usada por padrão: Celsius ou Fahrenheit?
6. A preferência de unidade deve ser persistida entre acessos?
7. Os dados deverão ser atualizados automaticamente? Com qual frequência?
8. A aplicação deverá exibir informações adicionais, como umidade, vento, pressão e índice UV?
9. O que deve acontecer quando a API estiver indisponível, mas houver dados anteriores em cache?
10. Qual é o público-alvo e quais navegadores/dispositivos precisam ser oficialmente suportados?
11. Quais requisitos de acessibilidade e conformidade são obrigatórios?
12. Haverá necessidade de histórico ou favoritos de cidades?
13. Quais limites de uso, custos e requisitos de autenticação existem para a API escolhida?
14. Qual formato de data, idioma e fuso horário deve ser adotado?
15. Quais métricas definirão o sucesso do produto?

## Suposições

1. A aplicação será inicialmente disponibilizada como uma aplicação web responsiva.
2. O usuário poderá consultar dados sem criar uma conta.
3. A primeira versão permitirá buscar uma cidade por nome.
4. Uma cidade selecionada será necessária antes da exibição do clima.
5. A previsão de cinco dias incluirá o dia atual ou começará no dia seguinte; essa decisão ainda precisa ser confirmada.
6. Celsius será a unidade padrão inicial, por ser a convenção mais provável para usuários em pt-BR.
7. A API fornecerá dados atuais e previsão diária suficiente para cinco dias.
8. A aplicação dependerá de conexão com a internet para realizar novas consultas.
9. Os dados exibidos representarão a última resposta válida recebida da API.
10. O escopo inicial não inclui alertas meteorológicos, notificações, favoritos ou histórico.
11. O escopo inicial não inclui previsão por hora.
12. O produto deverá tratar loading, erro e ausência de resultados como estados previstos, e não como exceções inesperadas.
