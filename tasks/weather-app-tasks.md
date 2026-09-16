# Backlog de Tarefas — Weather App

Este backlog foi ajustado para garantir critérios de aceite objetivos, verificáveis e rastreáveis aos requisitos da spec quando possível. Cada tarefa mantém menor escopo e descreve uma unidade testável que pode ser validada de forma independente.

---

## Entrega 1 — Tipos e funções puras

### T-01 — Definir tipos do domínio
- Tipo: Data
- Prioridade: P0
- Tamanho: M
- Descrição curta: Criar os contratos base do clima, cidade, cache e estado da aplicação.
- Critérios de aceite:
  - `src/types/weather.ts` define `Unit`, `City`, `CurrentWeather`, `ForecastDay`, `WeatherData` e `CachedWeather` com campos obrigatórios e opcionais explícitos.
  - `src/types/api.ts` define `SearchState` e `WeatherState` com `status` e `errorMessage` conforme o plano.
  - A compilação com TypeScript strict deve terminar sem erros de tipagem.
- Dependências: —
- Arquivos prováveis: `src/types/weather.ts`, `src/types/api.ts`
- Rastreabilidade: modelo de dados do plano; base para RF01-RF09.

### T-02 — Implementar conversão de temperatura
- Tipo: Data
- Prioridade: P0
- Tamanho: P
- Descrição curta: Criar função pura para converter Celsius e Fahrenheit sem depender de UI ou API.
- Critérios de aceite:
  - `toDisplayTemperature(valueC, unit)` retorna `undefined` quando `valueC` é `undefined`.
  - `0°C` converte para `32°F`, `100°C` para `212°F` e `-40°C` para `-40°F`.
  - A função está em `src/lib/temperature.ts` e é usada por componentes de clima atual e previsão.
- Dependências: T-01
- Arquivos prováveis: `src/lib/temperature.ts`
- Rastreabilidade: RF05 e AC05.

### T-03 — Validar entrada de busca e mensagens de estado
- Tipo: Data
- Prioridade: P0
- Tamanho: P
- Descrição curta: Centralizar regras de validação da query e mensagens de erro sem acoplar à interface.
- Critérios de aceite:
  - `validateCityQuery(value)` retorna inválido para strings vazias, `null`/`undefined` e apenas whitespace.
  - `trim()` é aplicado antes de qualquer busca ou validação.
  - A função retorna a mensagem padronizada `Digite o nome de uma cidade.` quando a entrada estiver vazia.
- Dependências: T-01
- Arquivos prováveis: `src/lib/validation.ts`
- Rastreabilidade: RF01, AC01, RF09/AC09.

### T-04 — Criar helpers de data e código meteorológico
- Tipo: Data
- Prioridade: P0
- Tamanho: M
- Descrição curta: Separar formatação de datas e mapeamento do `weather_code` em utilitários puros.
- Critérios de aceite:
  - `formatWeatherDate(date, timezone)` retorna “Hoje”, “Amanhã” ou o dia da semana para os casos cobertos pelo plano.
  - `mapWeatherCode(code)` retorna texto em pt-BR e um ícone compatível para códigos conhecidos.
  - Para código desconhecido, a função retorna fallback determinístico sem lançar exceção.
- Dependências: T-01
- Arquivos prováveis: `src/lib/date.ts`, `src/lib/weatherCode.ts`
- Rastreabilidade: RF03, RF04, AC03, AC04.

---

## Entrega 2 — Services e cache

### T-05 — Implementar cache local
- Tipo: Data
- Prioridade: P1
- Tamanho: M
- Descrição curta: Persistir a unidade preferida e o cache meteorológico em `localStorage` com validação de expiração.
- Critérios de aceite:
  - `weather-unit` salva e recupera a configuração do usuário; valores inválidos são substituídos por `celsius`.
  - `weather-cache:<city.id>` armazena apenas objetos com `data` e `cachedAt` válidos.
  - Registros com `cachedAt` vencido há mais de 30 minutos devem ser descartados.
  - Dados corrompidos ou sem `cachedAt` válido não são aceitos.
- Dependências: T-01
- Arquivos prováveis: `src/services/cacheService.ts`
- Rastreabilidade: RF06-RF08, RNF08, RNF09.

### T-06 — Normalizar resposta de geocoding
- Tipo: Data
- Prioridade: P0
- Tamanho: M
- Descrição curta: Validar e mapear a resposta da API de geocoding para `City[]`.
- Critérios de aceite:
  - `normalizeCityResults(raw)` cria objetos com `id`, `name`, `country`, `countryCode`, `region`, `latitude`, `longitude` e `timezone` quando disponíveis.
  - Se `results` não existir ou estiver vazio, a função retorna `[]`.
  - `id`, `name`, `latitude` e `longitude` são obrigatórios para que uma cidade seja considerada válida.
- Dependências: T-01, T-03
- Arquivos prováveis: `src/services/geocodingService.ts`
- Rastreabilidade: RF01, AC01, AC02.

### T-07 — Buscar cidades com timeout e tratamento de erro
- Tipo: Data
- Prioridade: P0
- Tamanho: M
- Descrição curta: Executar o request de geocoding e transformar falhas externas em erro interno padronizado.
- Critérios de aceite:
  - `searchCities(query)` usa `fetch`, `AbortController` e timeout de 10 segundos.
  - `response.ok` deve ser true; caso contrário, a função gera erro com categoria `api` e `statusCode` quando disponível.
  - Falha de rede, timeout ou JSON inválido produz erro interno com categoria `network`, `timeout` ou `invalid-response`.
  - Nenhum detalhe técnico da falha deve ser exposto na UI.
- Dependências: T-05, T-06
- Arquivos prováveis: `src/services/geocodingService.ts`
- Rastreabilidade: RF01, AC01, AC02, RNF07.

### T-08 — Normalizar resposta de forecast
- Tipo: Data
- Prioridade: P0
- Tamanho: M
- Descrição curta: Transformar a resposta da API de forecast em `WeatherData` com cinco dias válidos.
- Critérios de aceite:
  - `normalizeForecastResponse(raw, city)` retorna um objeto com `city`, `timezone`, `current`, `forecast` e `fetchedAt`.
  - `forecast` deve conter exatamente cinco itens válidos após normalização.
  - Qualquer item sem `date`, `minTemperatureC`, `maxTemperatureC` ou `weatherCode` deve ser descartado.
  - A resposta só é aceita se `timezone`, `current` e as séries diárias forem compatíveis com o contrato.
- Dependências: T-01, T-05
- Arquivos prováveis: `src/services/weatherService.ts`
- Rastreabilidade: RF03, RF04, AC03, AC04.

### T-09 — Buscar clima com timeout e manejo de cache
- Tipo: Data
- Prioridade: P0
- Tamanho: M
- Descrição curta: Consultar o forecast da cidade selecionada e manter a última resposta válida em caso de falha.
- Critérios de aceite:
  - `fetchForecast(city)` usa `fetch` com `AbortController` e timeout de 10 segundos.
  - Em falha de rede, API ou timeout, o último `WeatherData` válido continua visível na UI e `isStale` vira `true`.
  - Em ausência de cache válido, a UI deve mostrar apenas o erro, sem manter dados antigos.
  - Uma resposta incompleta deve resultar em `unavailable` ou `error` conforme o plano.
- Dependências: T-05, T-08
- Arquivos prováveis: `src/services/weatherService.ts`
- Rastreabilidade: RF03, RF04, RF06, RF07, AC03, AC04, AC06, AC07.

---

## Entrega 3 — Hook e estado da aplicação

### T-10 — Definir a máquina de estados do hook
- Tipo: Data
- Prioridade: P0
- Tamanho: M
- Descrição curta: Centralizar as transições de busca, clima e unidade no hook principal.
- Critérios de aceite:
  - O hook expõe `searchCity`, `selectCity`, `refreshWeather` e `setTemperatureUnit`.
  - O estado de busca e o estado de clima suportam `idle`, `loading`, `success`, `empty`, `error` e `unavailable`.
  - `refreshWeather()` não cria consultas concorrentes; se falhar com dado anterior, o estado mantém `isStale = true`.
  - A alternância de unidade não dispara nova chamada de forecast.
- Dependências: T-02, T-03, T-05, T-07, T-09
- Arquivos prováveis: `src/hooks/useWeatherApp.ts`
- Rastreabilidade: RF05-RF09, AC05-AC09.

---

## Entrega 4 — Componentes e UI

---

### T-11 — Criar formulário de busca
- Tipo: UI
- Prioridade: P0
- Tamanho: M
- Descrição curta: Implementar input, botão de busca e integração com o hook.
- Critérios de aceite:
  - O campo aceita `Enter` e dispara a busca somente quando `trim()` da query não está vazio.
  - Quando a busca é vazia, o formulário exibe a mensagem `Digite o nome de uma cidade.`
  - O componente usa label/role semântico e não chama `fetch` diretamente.
- Dependências: T-03, T-10
- Arquivos prováveis: `src/components/SearchForm.tsx`
- Rastreabilidade: RF01, AC01, AC02, RNF03.

### T-12 — Criar lista de resultados da busca
- Tipo: UI
- Prioridade: P0
- Tamanho: M
- Descrição curta: Exibir as cidades retornadas e permitir a seleção da escolhida.
- Critérios de aceite:
  - A listagem renderiza cada cidade com `name`, `country` e `region` quando disponíveis.
  - Ao clicar em um item, a cidade deve ser passada para `selectCity(city)`.
  - Se a busca não retornar cidades, o componente exibe `Nenhuma cidade encontrada.`
- Dependências: T-07, T-10
- Arquivos prováveis: `src/components/CityResults.tsx`
- Rastreabilidade: RF01, AC01, AC02.

### T-13 — Criar mensagens de carregamento, erro e retry
- Tipo: UI
- Prioridade: P0
- Tamanho: P
- Descrição curta: Separar os feedbacks visuais de loading, erro e indisponibilidade.
- Critérios de aceite:
  - Em loading, a UI exibe texto `Carregando…` e spinner ou equivalente acessível.
  - Em erro, a mensagem precisa ser `Não foi possível carregar os dados do clima.` e deve haver botão de retry.
  - Em resposta indisponível, a UI mostra `Dados indisponíveis no momento.`
- Dependências: T-10
- Arquivos prováveis: `src/components/StatusMessage.tsx`, `src/components/RefreshButton.tsx`
- Rastreabilidade: RF06-RF09, AC06-AC09.

### T-14 — Criar card de clima atual
- Tipo: UI
- Prioridade: P0
- Tamanho: M
- Descrição curta: Renderizar o clima atual da cidade selecionada com fallback seguro para campos ausentes.
- Critérios de aceite:
  - O card exibe temperatura atual, sensação térmica, umidade, vento e condição meteorológica.
  - Campos ausentes devem renderizar `—` em vez de valor inventado.
  - A temperatura é formatada conforme a unidade selecionada e usa `°C` ou `°F`.
- Dependências: T-02, T-04, T-10
- Arquivos prováveis: `src/components/CurrentWeather.tsx`
- Rastreabilidade: RF03, RF04, RF05, AC03, AC04, AC05.

### T-15 — Criar previsão de cinco dias
- Tipo: UI
- Prioridade: P0
- Tamanho: M
- Descrição curta: Montar a lista de previsão com data, mínima, máxima e condição climática.
- Critérios de aceite:
  - A previsão renderiza exatamente cinco itens válidos.
  - Cada item mostra data, temperatura mínima, temperatura máxima e condição meteorológica.
  - Se houver menos de cinco itens válidos, a UI exibe `Dados indisponíveis no momento.`
- Dependências: T-04, T-08, T-10
- Arquivos prováveis: `src/components/ForecastList.tsx`
- Rastreabilidade: RF03, RF04, AC03, AC04.

### T-16 — Criar unidade e refresh manual
- Tipo: UI
- Prioridade: P1
- Tamanho: M
- Descrição curta: Permitir alternância de °C/°F e recarga manual do clima sem nova busca por cidade.
- Critérios de aceite:
  - `UnitToggle` salva a preferência em `localStorage` e aplica a conversão na renderização sem chamar nova API.
  - `RefreshButton` invoca `refreshWeather()` e evita requisições concorrentes.
  - A troca de unidade não gera novo request de forecast.
- Dependências: T-02, T-05, T-10
- Arquivos prováveis: `src/components/UnitToggle.tsx`, `src/components/RefreshButton.tsx`
- Rastreabilidade: RF05, AC05, RF09, AC09.

### T-17 — Integrar a aplicação completa
- Tipo: UI
- Prioridade: P0
- Tamanho: G
- Descrição curta: Montar a tela principal com busca, clima atual, previsão e estados de erro.
- Critérios de aceite:
  - `App.tsx` compõe os blocos principais da aplicação e usa o hook como fonte de estado.
  - O layout permanece legível e sem overflow horizontal em 320px, 768px, 1024px e 1440px.
  - Cada estado visível da aplicação (idle, loading, empty, error, success, unavailable) é representado pela UI.
- Dependências: T-11, T-12, T-13, T-14, T-15, T-16
- Arquivos prováveis: `src/App.tsx`, `src/main.tsx`
- Rastreabilidade: RF01-RF09, RNF01-RNF06.

---

## Entrega 5 — Testes

### T-18 — Testar conversão de unidade em utilitários
- Tipo: Test
- Prioridade: P1
- Tamanho: P
- Descrição curta: Cobrir a lógica de conversão Celsius/Fahrenheit e o comportamento com valores ausentes.
- Critérios de aceite:
  - `toDisplayTemperature()` cobre 0°C, 100°C, -40°C e valores `undefined`.
  - Os testes verificam conversão exata para °F e preservam a fonte de verdade em Celsius.
  - O arquivo de teste é dedicado à conversão de unidade e não inclui outras funções puras.
- Dependências: T-02
- Arquivos prováveis: `tests/unit/temperature.test.ts`
- Rastreabilidade: RF05, AC05.

### T-19 — Testar services com mock de `fetch`
- Tipo: Test
- Prioridade: P1
- Tamanho: M
- Descrição curta: Validar geocoding, forecast e cache com respostas simuladas e `globalThis.fetch` mockado.
- Critérios de aceite:
  - `geocodingService` cobre sucesso, resposta vazia, timeout, HTTP error e JSON inválido.
  - `weatherService` cobre sucesso, resposta parcial, resposta inválida e fallback para cache.
  - O teste mocka `fetch` sem depender da rede e cobre a normalização de payloads reais.
- Dependências: T-05, T-07, T-08, T-09
- Arquivos prováveis: `tests/unit/services.test.ts`
- Rastreabilidade: RF01-RF08, AC01-AC08.

### T-20 — Cobrir o hook de estado
- Tipo: Test
- Prioridade: P1
- Tamanho: M
- Descrição curta: Verificar as transições do estado e o comportamento de refresh e unidade.
- Critérios de aceite:
  - O hook cobre `idle -> loading -> success`, `empty` e `error`.
  - `refreshWeather()` em falha mantém o último dado e marca `isStale = true`.
  - `setTemperatureUnit()` altera a unidade sem disparar nova requisição de forecast.
- Dependências: T-10, T-16
- Arquivos prováveis: `tests/unit/useWeatherApp.test.tsx`
- Rastreabilidade: RF05-RF09, AC05-AC09.

### T-21 — Testar componentes nos estados loading, erro e vazio
- Tipo: Test
- Prioridade: P1
- Tamanho: M
- Descrição curta: Validar renderização dos estados críticos da UI em componentes isolados.
- Critérios de aceite:
  - `SearchForm` e `CityResults` cobrem loading, empty e error para busca.
  - `StatusMessage` cobre os textos `Carregando…`, `Nenhuma cidade encontrada.` e `Não foi possível carregar os dados do clima.`
  - O teste verifica botão de retry e ausência de renderização de dados inválidos.
- Dependências: T-11, T-12, T-13
- Arquivos prováveis: `tests/unit/components-state.test.tsx`
- Rastreabilidade: RF01, RF06-RF09, AC01, AC06-AC09.

### T-22 — Cobrir E2E do fluxo principal com viewport mobile
- Tipo: Test
- Prioridade: P1
- Tamanho: G
- Descrição curta: Validar a jornada principal do usuário em navegador, incluindo mobile-first em 320px.
- Critérios de aceite:
  - O usuário consegue buscar uma cidade, selecionar uma opção e visualizar clima atual e previsão de cinco dias.
  - O cenário é executado em viewport mobile de 320px e em desktop para validação de layout.
  - O teste usa `page.route` para interceptar a API e manter o fluxo determinístico.
  - A aplicação não quebra em Chromium, Firefox e WebKit.
- Dependências: T-17, T-21
- Arquivos prováveis: `tests/e2e/weather-flow.spec.ts`
- Rastreabilidade: RF01-RF05, AC01-AC05, RNF01, RNF06.

### T-23 — Cobrir E2E de erro e responsividade
- Tipo: Test
- Prioridade: P1
- Tamanho: M
- Descrição curta: Validar retry, falhas de rede e layout em telas pequenas.
- Critérios de aceite:
  - O fluxo cobre busca vazia, timeout, erro de rede e resposta parcial.
  - O retry recupera a tela sem perder o último dado válido.
  - O layout é validado em 320px, 768px, 1024px e 1440px sem overflow horizontal.
- Dependências: T-17, T-21
- Arquivos prováveis: `tests/e2e/resilience.spec.ts`
- Rastreabilidade: RF06-RF09, RNF01, RNF04, RNF05, RNF06.

---

## Entrega 6 — Hardening

### T-24 — Revisar acessibilidade e foco visual
- Tipo: UI
- Prioridade: P2
- Tamanho: M
- Descrição curta: Ajustar navegação por teclado, contraste e semântica dos controles.
- Critérios de aceite:
  - Todos os controles principais devem ser operáveis por teclado.
  - O foco visível deve permanecer visível em todos os estados da tela.
  - Labels, roles e contraste devem estar consistentes com as regras de acessibilidade do projeto.
- Dependências: T-17, T-21
- Arquivos prováveis: `src/components/*.tsx`, `tests/e2e/*.spec.ts`
- Rastreabilidade: RNF03, RNF06.

### T-25 — Implementar logging e bloquear concorrência
- Tipo: Infra
- Prioridade: P2
- Tamanho: M
- Descrição curta: Registrar diagnósticos leves sem expor dados sensíveis e impedir requests simultâneos redundantes.
- Critérios de aceite:
  - Logs de diagnóstico incluem origem, duração e código HTTP quando disponível.
  - Não há URL completa, consulta completa ou dados pessoais nos logs.
  - Busca e refresh evitam múltiplas requisições simultâneas para o mesmo contexto.
- Dependências: T-09, T-10, T-23
- Arquivos prováveis: `src/services/*.ts`, `src/hooks/useWeatherApp.ts`
- Rastreabilidade: RNF07, RNF10.

### T-26 — Garantir ausência de polling automático no MVP
- Tipo: Infra
- Prioridade: P2
- Tamanho: M
- Descrição curta: Validar que a aplicação não executa atualização periódica automática sem ação do usuário.
- Critérios de aceite:
  - O código da aplicação não inicia `setInterval`, `setTimeout` recorrente ou polling para consulta meteorológica em background.
  - A atualização de dados acontece somente por ação explícita do usuário (botão de refresh) ou por recarga manual da página.
  - O teste E2E confirma que, após o carregamento inicial, a aplicação não dispara nova requisição automática sem interação do usuário.
- Dependências: T-10, T-16, T-23
- Arquivos prováveis: `src/hooks/useWeatherApp.ts`, `src/App.tsx`, `tests/e2e/weather-flow.spec.ts`
- Rastreabilidade: RF09, AC09, RNF04.

---

## Observação final

As tarefas foram revisadas para que cada critério de aceite seja verificável por inspeção, teste unitário, teste de componente ou teste E2E. Sempre que possível, a rastreabilidade foi ligada aos requisitos funcionais e não funcionais da spec, mantendo a sequência lógica de implementação e validação.
