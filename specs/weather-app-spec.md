# Especificação do Produto — Weather App

## Overview

A aplicação web de previsão do tempo tem como objetivo permitir que usuários consultem rapidamente o clima atual e a previsão dos próximos cinco dias de cidades de interesse. A solução deve oferecer uma experiência simples, responsiva e acessível, priorizando a busca por cidade, a visualização de condições meteorológicas e a alternância entre Celsius e Fahrenheit.

A aplicação será desenvolvida como uma SPA (Single Page Application) responsiva, sem autenticação e sem necessidade de chave de API para o cliente. O produto usará o serviço Open-Meteo para geocodificação e consulta meteorológica. A interface deve funcionar bem em celulares, tablets e desktops, com foco em clareza visual, feedback imediato e robustez em cenários de rede instável.

O escopo inicial inclui:

- Busca por cidade por nome.
- Seleção de uma cidade a partir dos resultados da busca.
- Exibição do clima atual com dados principais e complementares.
- Exibição da previsão de cinco dias, incluindo o dia atual e os quatro dias seguintes.
- Alternância entre °C e °F.
- Mensagens claras para estados de carregamento, erro, vazio e ausência de dados.
- Tratamento de falhas temporárias, timeout e dados parcialmente indisponíveis.

## Functional Requirements

### RF01 — Buscar cidade
O sistema deve permitir que o usuário informe um nome de cidade e visualize resultados correspondentes. Cada resultado deve exibir, no mínimo, o nome da cidade, o país e a região/estado quando disponível. Esses dados devem permitir identificar corretamente a cidade em casos de homônimos.

### RF02 — Selecionar cidade
Após a busca, o sistema deve permitir que o usuário selecione uma cidade da lista de resultados para consultar os dados meteorológicos. A cidade escolhida deve tornar-se o contexto atual da aplicação para o clima atual e a previsão dos próximos cinco dias.

### RF03 — Visualizar clima atual
Após a seleção de uma cidade, o sistema deve exibir o clima atual com, no mínimo, temperatura, sensação térmica, umidade, velocidade do vento e condição climática, além do ícone correspondente. A interface deve usar o fuso horário da cidade selecionada para a apresentação de datas e horas relevantes.

### RF04 — Visualizar previsão de cinco dias
O sistema deve apresentar a previsão para o dia atual e mais quatro dias, totalizando cinco itens, com data ou dia da semana, temperatura mínima, temperatura máxima e condição climática de cada dia. A lista deve seguir o fuso horário da cidade selecionada.

### RF05 — Alternar unidade de temperatura
O usuário deve poder alternar entre Celsius (°C) e Fahrenheit (°F). A seleção deve aplicar a todos os valores de temperatura exibidos na interface e deve ser persistida no navegador usando localStorage para a próxima visita. A conversão deve ocorrer localmente, sem exigir nova consulta à API.

### RF06 — Informar estados da aplicação
O sistema deve comunicar claramente ao usuário os estados de carregamento, erro, busca sem resultados, ausência de cidade selecionada e ausência de dados meteorológicos. Durante a busca ou consulta, a interface deve exibir spinner e o texto “Carregando…”; em caso de erro, deve apresentar mensagens padronizadas e uma ação explícita para tentar novamente.

### RF07 — Atualizar dados meteorológicos
O usuário deve poder solicitar uma nova consulta dos dados meteorológicos da cidade selecionada, por meio de uma ação explícita. A aplicação deve manter a última resposta válida em tela caso a nova consulta falhe e exibir a indicação “Dados desatualizados”.

### RF08 — Suportar cache local e recuperação em falha
Quando houver uma consulta meteorológica válida anterior e a nova consulta falhar, o sistema deve priorizar os dados em cache, marcar os dados como potencialmente desatualizados e impedir que a interface trave. O cache deve ser armazenado localmente no navegador e não deve depender de backend próprio.

### RF09 — Atualização automática da previsão
Na versão inicial, o sistema não deve atualizar automaticamente os dados meteorológicos em intervalos definidos. As consultas devem ocorrer somente por ação explícita do usuário ou pela recarga manual da página. Essa regra deve ser mantida para reduzir consumo de rede e manter previsibilidade de comportamento.

## User Stories

- Como Viajante que planeja a semana, quero buscar uma cidade e consultar a previsão de cinco dias para escolher uma data ou destino com menor risco de chuva e condições adversas. (RF01, RF04)
- Como Pessoa decidindo a roupa do dia, quero consultar o clima atual e a sensação térmica para decidir rapidamente o que vestir antes de sair de casa. (RF03)
- Como Profissional que trabalha ao ar livre, quero acompanhar a temperatura, a umidade e o vento da cidade de trabalho para ajustar a rotina e planejar atividades. (RF03, RF06)
- Como Viajante que planeja a semana, quero identificar corretamente a cidade desejada entre resultados homônimos para evitar consultar a cidade errada antes de tomar uma decisão. (RF01, RF02)
- Como Pessoa decidindo a roupa do dia, quero alternar entre °C e °F para interpretar a temperatura na unidade com a qual me sinto mais confortável. (RF05)
- Como Profissional que trabalha ao ar livre, quero receber feedback claro de carregamento e erro para saber se os dados estão atualizados ou se preciso tentar novamente. (RF06, RF07, RF08)
- Como Pessoa decidindo a roupa do dia, quero ver uma mensagem clara quando a busca não encontrar resultados ou quando não houver dados para entender rapidamente o que fazer. (RF06, RF08)

As histórias acima foram estruturadas no formato "Como [persona], quero [ação] para [valor]" e cada uma está diretamente conectada a um ou mais requisitos funcionais da aplicação.

## Acceptance Criteria

### AC01 — Busca de cidade
- Dado que o usuário digitou um termo válido em campo de busca, quando ele inicia a pesquisa, então o sistema deve apresentar uma lista de cidades correspondentes com nome da cidade, país e região/estado quando disponíveis.
- Dado que a pesquisa não retorna resultados, quando o usuário submete o termo, então o sistema deve exibir a mensagem "Nenhuma cidade encontrada." e não deve renderizar dados meteorológicos.
- Dado que o campo de busca está vazio ou contém apenas espaços, quando o usuário tenta realizar a busca, então o sistema não deve disparar a consulta e deve exibir a mensagem "Digite o nome de uma cidade."

### AC02 — Seleção de cidade
- Dado uma lista de resultados de busca, quando o usuário seleciona uma cidade, então o sistema deve carregar os dados meteorológicos da cidade escolhida e exibir o nome da cidade selecionada.
- Dado que a seleção de cidade foi concluída, quando os dados forem carregados, então o sistema deve substituir qualquer estado anterior e exibir as informações da cidade selecionada.

### AC03 — Clima atual
- Dado que uma cidade foi selecionada, quando os dados meteorológicos forem obtidos com sucesso, então o sistema deve exibir, em uma única tela, o nome da cidade, a localização associada, a temperatura atual, a condição climática, o ícone correspondente, a sensação térmica, a umidade e a velocidade do vento.
- Dado que algum campo complementar estiver ausente na resposta da API, quando a interface renderizar os resultados, então o sistema deve exibir o valor "—" para esse campo e continuar exibindo o restante das informações sem quebrar o layout.

### AC04 — Previsão de cinco dias
- Dado que uma cidade foi selecionada, quando a consulta de previsão for bem-sucedida, então o sistema deve renderizar exatamente cinco itens de previsão, cobrindo o dia atual e os quatro dias seguintes.
- Dado cada item da previsão, quando a interface renderizar os dados, então o sistema deve apresentar a data ou o dia da semana, a temperatura mínima, a temperatura máxima e a condição climática para esse dia.

### AC05 — Alternância de temperatura
- Dado que a interface está exibindo valores em Celsius, quando o usuário alterna para Fahrenheit, então todas as temperaturas exibidas no clima atual e na previsão devem ser convertidas usando a fórmula F = (C × 9/5) + 32, sem nova solicitação à API.
- Dado que a interface está exibindo valores em Fahrenheit, quando o usuário alterna para Celsius, então todas as temperaturas exibidas devem ser convertidas usando a fórmula C = (F - 32) × 5/9, sem nova solicitação à API.
- Dado um valor decimal de temperatura, quando a conversão for aplicada, então o sistema deve manter o valor com precisão suficiente para exibir, no mínimo, uma casa decimal e manter consistência visual entre todos os elementos de temperatura.
- Dado que o usuário atualiza a página, quando a unidade preferida estiver salva no navegador, então a interface deve reaproveitar a unidade escolhida anteriormente.

### AC06 — Estados da aplicação
- Dado que a busca ou a consulta meteorológica está em andamento, quando a interface estiver carregando, então deve ser exibido um indicador visual de carregamento com o texto "Carregando…" e o usuário deve receber feedback de que a operação está em andamento.
- Dado que uma consulta falha por erro de rede ou serviço, quando a resposta retornar erro, então o sistema deve exibir a mensagem "Não foi possível carregar os dados do clima." com uma ação explícita para tentar novamente.
- Dado que uma busca não encontrou resultados, quando a operação terminar, então o sistema deve mostrar o estado vazio "Nenhuma cidade encontrada." sem apresentar dados de uma cidade anterior de forma enganosa.
- Dado que não há cidade selecionada, quando a aplicação abrir pela primeira vez, então a interface deve informar ao usuário que ele deve buscar uma cidade antes de consultar o clima.
- Dado que não há dados meteorológicos disponíveis, quando a consulta não fornecer conteúdo válido, então o sistema deve exibir a mensagem "Dados indisponíveis no momento." e manter a interface funcional.

### AC07 — Atualização de dados
- Dado que uma cidade já foi selecionada, quando o usuário aciona uma ação de atualizar ou recarregar, então o sistema deve iniciar uma nova consulta usando a cidade atual, exibir estado de carregamento e manter a interface responsiva durante a operação.
- Dado que a nova consulta falha, quando o processo terminar, então o sistema deve preservar a última consulta válida, se houver, marcar a informação como potencialmente desatualizada e informar o usuário sobre a falha sem travar a interface.

### AC08 — Cache e uso offline local
- Dado que exista uma consulta meteorológica válida em cache, quando a nova consulta falhar, então o sistema deve apresentar os dados em cache e exibir a mensagem "Dados desatualizados" junto com a informação atual exibida.
- Dado que o navegador não tenha cache disponível, quando a consulta falhar, então o sistema deve exibir a mensagem de erro sem quebrar a interface.

### AC09 — Atualização automática
- Dado que o app está em sua versão inicial, quando o usuário não aciona a recarga manualmente, então o sistema não deve disparar consultas automáticas em intervalos definidos.
- Dado que o usuário solicita uma nova consulta, quando a operação for iniciada, então a interface deve exibir estado de carregamento e aguardar a resposta da API.

## Non-Functional Requirements

### RNF01 — Responsividade
A interface deve funcionar de forma adequada em larguras de tela de 320 px, 768 px, 1024 px e 1440 px, sem perda de conteúdo, sobreposição de elementos ou rolagem horizontal desnecessária.

### RNF02 — Usabilidade
A navegação deve ser compreensível sem treinamento prévio. A hierarquia visual deve colaborar para que o usuário identifique rapidamente o clima atual, a previsão e os controles principais.

### RNF03 — Acessibilidade
A aplicação deve utilizar HTML semântico, labels e nomes acessíveis para controles, contraste adequado para texto e fundo e foco visível em elementos interativos. A navegação completa por teclado deve ser possível, e mensagens de erro devem estar associadas aos elementos corretos.

### RNF04 — Performance
A aplicação deve apresentar feedback visual imediatamente ao iniciar uma consulta e evitar requisições redundantes. Em condições normais de rede, a busca de cidade e a consulta meteorológica devem iniciar uma resposta inicial em até 2 segundos, quando a rede e o serviço estiverem operando normalmente.

### RNF05 — Resiliência e disponibilidade
Falhas temporárias, indisponibilidade do serviço externo ou respostas inválidas não devem travar a interface. O usuário deve receber mensagens orientativas e a interface deve continuar operável.

### RNF06 — Compatibilidade
A aplicação deve ser compatível com as versões atuais de Chrome, Firefox, Safari e Edge em plataformas desktop e mobile.

### RNF07 — Segurança e privacidade
A aplicação não deve solicitar informações pessoais desnecessárias. Toda comunicação com serviços externos deve ocorrer via HTTPS e não deve expor chaves ou credenciais sensíveis no cliente.

### RNF08 — Internacionalização
A interface deve operar em pt-BR, com consistente uso de idioma, formato de data, unidade de temperatura e linguagem de mensagens. O padrão inicial deve ser Celsius.

### RNF09 — Cache e recuperação de dados
Quando houver uma consulta meteorológica válida anterior, o sistema deve preferencialmente reutilizar esses dados em cenários de falha de nova consulta, sinalizando visualmente que a informação pode estar desatualizada. O cache local deve ser armazenado no navegador, protegido contra dados inválidos e mantido por até 30 minutos, ou até a próxima consulta bem-sucedida.

### RNF10 — Observabilidade
Erros de busca, falhas de serviço, tempo de resposta e estado de rede devem ser registráveis em logs de diagnóstico, sem incluir dados pessoais desnecessários. O app deve registrar, no mínimo, a origem da falha, o tempo de resposta e o código de erro quando disponível.

## Edge Cases

1. Cidade inexistente: quando o termo informado não corresponde a nenhum resultado válido, o sistema deve exibir uma mensagem de “nenhuma cidade encontrada” e não renderizar dados de outra cidade.
2. Busca com texto vazio: quando o campo de busca estiver vazio, o sistema não deve disparar a requisição e deve indicar que o usuário deve informar um termo.
3. Caracteres especiais e acentos: quando o termo usar acentos, caracteres especiais ou variações de grafia, o sistema deve realizar uma busca compatível e apresentar resultados esperados, sem quebrar a operação.
4. Erro da API de geocodificação: quando o serviço de busca de cidades falhar, o sistema deve mostrar uma mensagem de erro e manter a tela funcional.
5. Timeout de rede: quando a consulta demorar além do limite configurado, o sistema deve informar que houve falha de comunicação e permitir nova tentativa.
6. Resposta parcial da API: quando a resposta do serviço vier incompleta ou com campos nulos, o sistema deve exibir apenas os dados disponíveis e manter o restante da interface estável.
7. Falha na consulta meteorológica após seleção: quando a cidade já foi selecionada, mas a consulta de clima falhar, o sistema deve mostrar erro sem perder a última cidade válida selecionada e sem bloquear a UI.
8. Múltiplas cidades com o mesmo nome: quando houver cidades homônimas, o sistema deve mostrar identificadores complementares como país ou região para facilitar a escolha correta.

## Assumptions

- A aplicação será disponibilizada como uma aplicação web responsiva e estática.
- O usuário consultará o clima sem realizar login ou cadastro.
- O público-alvo principal será usuário brasileiro, com interface em pt-BR.
- O app dependerá de conexão com a internet para realizar novas consultas.
- A primeira versão permitirá buscar cidades por nome, não por coordenadas, CEP ou geolocalização automática.
- O produto usará a unidade Celsius como padrão e permitirá alternância para Fahrenheit.
- A preferência de unidade será persistida no navegador e reaproveitada na próxima visita usando localStorage.
- A integração com Open-Meteo será suficiente para atender ao escopo inicial de busca e previsão.
- O cache local será utilizado para preservar a última consulta válida em caso de falha de rede e terá validade de até 30 minutos.
- O escopo inicial não inclui histórico persistente, favoritos, alertas ou notificações.
- A versão inicial não fará refresh automático em intervalos definidos; as consultas serão acionadas pelo usuário.

## Risks

- Indisponibilidade ou instabilidade da API meteorológica: pode impedir consultas e comprometer a experiência do usuário. Mitigação: timeout, tratamento de erros, cache da última resposta válida e mensagens orientativas.
- Seleção incorreta de cidades homônimas: pode levar o usuário a consultar a cidade errada. Mitigação: exibir país, região e outros identificadores geográficos nos resultados.
- Dados incompletos ou inconsistentes da API: podem quebrar a interface ou gerar informações enganosas. Mitigação: validação de resposta, uso de valores padrão e renderização defensiva.
- Experiência inadequada em telas pequenas: pode prejudicar o uso em celular. Mitigação: abordagem mobile-first, testes em diferentes larguras e simplificação visual.
- Interpretação incorreta de datas, fusos e horário local: pode gerar confusão na previsão. Mitigação: definir claramente o uso de fuso e formatar datas de forma consistente.
- Conversão incorreta entre Celsius e Fahrenheit: pode gerar dados inconsistentes. Mitigação: centralizar a conversão em lógica pura, verificada por testes.
- Conectividade instável: pode causar falhas e perda de clareza na interação. Mitigação: feedback apropriado de carregamento e erro, além de cache de último dado válido.

## Out of Scope

A seguir estão funcionalidades e comportamentos explicitamente fora do escopo inicial do MVP do Weather App e, portanto, não são necessários para o desenvolvimento desta versão:

- Autenticação, cadastro e gestão de usuários.
- Persistência de histórico de buscas, favoritos, listas personalizadas ou cidades salvas.
- Geolocalização automática do usuário e uso de localização em segundo plano.
- Comparação simultânea de múltiplas cidades em uma mesma tela.
- Previsão por hora em intervalos curtos ou detalhamento meteorológico em granularidade inferior a 24 horas.
- Histórico climático de anos anteriores ou análise climatológica longa.
- Alertas meteorológicos, notificações push, e-mails ou avisos automáticos de risco.
- Mapa interativo, radar, satélite ou visualização geográfica da condição climática.
- Internacionalização além do idioma pt-BR inicial.
- Integração com múltiplas APIs meteorológicas ou backend próprio para cache, autenticação ou persistência.
- Suporte a PWA installável, notificações do navegador ou sincronização offline completa em background.
- Personalização visual avançada, temas alternativos, widgets compartilháveis ou exportação de dados.
- API pública do produto, integrações com terceiros ou painel administrativo para operação.

## Open Questions

1. A busca por cidade deve aceitar apenas texto ou também coordenadas e geolocalização automática em versões futuras?
2. O app deve expor métricas de uso para análise de produto e UX em futuras iterações?
3. A sua experiência em produção exige logs mais detalhados além de origem da falha, tempo de resposta e código de erro?
4. O projeto deve evoluir para suporte de atualização automática em uma próxima versão, ou a política atual permanece fixa para toda a vida útil do MVP?

> Observação: as decisões críticas para a v1 foram fechadas neste documento, e as questões restantes não bloqueiam a implementação do MVP.

## Resumo de rastreabilidade

| User Story | Requisitos funcionais | Acceptance Criteria | Requisitos não-funcionais relevantes | Observação para tarefas/testes |
| --- | --- | --- | --- | --- |
| Como Viajante que planeja a semana, quero buscar uma cidade e consultar a previsão de cinco dias para escolher uma data ou destino com menor risco de chuva e condições adversas. | RF01, RF04 | AC01, AC04 | RNF02, RNF04, RNF08 | Cobrir busca, seleção de cidade e previsão de 5 dias; validar data/dia, temperaturas e estado vazio em busca sem resultado. |
| Como Pessoa decidindo a roupa do dia, quero consultar o clima atual e a sensação térmica para decidir rapidamente o que vestir antes de sair de casa. | RF03 | AC03 | RNF02, RNF04, RNF08 | Validar renderização do clima atual, campos principais e fallback para valores ausentes. |
| Como Profissional que trabalha ao ar livre, quero acompanhar a temperatura, a umidade e o vento da cidade de trabalho para ajustar a rotina e planejar atividades. | RF03, RF06 | AC03, AC06 | RNF01, RNF02, RNF03, RNF05 | Validar clareza visual, acessibilidade e estados de carregamento/erro em disponibilidade de dados. |
| Como Viajante que planeja a semana, quero identificar corretamente a cidade desejada entre resultados homônimos para evitar consultar a cidade errada antes de tomar uma decisão. | RF01, RF02 | AC01, AC02 | RNF02, RNF03 | Cobrir exibição de país/região, seleção correta e ausência de ambiguidade no resultado. |
| Como Pessoa decidindo a roupa do dia, quero alternar entre °C e °F para interpretar a temperatura na unidade com a qual me sinto mais confortável. | RF05 | AC05 | RNF08, RNF02 | Validar a conversão matemática, persistência em localStorage e consistência visual de todas as temperaturas. |
| Como Profissional que trabalha ao ar livre, quero receber feedback claro de carregamento e erro para saber se os dados estão atualizados ou se preciso tentar novamente. | RF06, RF07, RF08 | AC06, AC07, AC08 | RNF04, RNF05, RNF09, RNF10 | Cobrir estados de carregamento, falha de rede, uso de cache e mensagem de dados desatualizados. |
| Como Pessoa decidindo a roupa do dia, quero ver uma mensagem clara quando a busca não encontrar resultados ou quando não houver dados para entender rapidamente o que fazer. | RF06, RF08 | AC06, AC08, AC09 | RNF05, RNF09 | Validar estado vazio de busca, dados indisponíveis e comportamento sem travar a interface. |

### Mapeamento por tipo de validação

- Testes unitários: AC05 (conversão de temperatura), AC09 (sem refresh automático), RNF09 (expiração de cache).
- Testes de UI: AC01, AC02, AC03, AC04, AC06, AC07, AC08.
- Testes de acessibilidade: AC06, RNF03.
- Testes de resiliência: AC07, AC08, RNF05, RNF09, RNF10.
- Testes de responsividade: RNF01 e comportamento visual em telas pequenas.
