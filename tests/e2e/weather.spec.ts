import { expect, test } from '@playwright/test';

test('busca uma cidade, exibe a previsão e alterna para Fahrenheit', async ({ page }) => {
  let forecastRequests = 0;

  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        results: [
          {
            id: 1,
            name: 'São Paulo',
            latitude: -23.55,
            longitude: -46.63,
            country: 'Brasil',
            country_code: 'BR',
            admin1: 'São Paulo',
            timezone: 'America/Sao_Paulo',
          },
        ],
      }),
    });
  });

  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    forecastRequests += 1;
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        timezone: 'America/Sao_Paulo',
        current: {
          time: '2026-09-16T12:00',
          temperature_2m: 20,
          apparent_temperature: 21,
          relative_humidity_2m: 65,
          wind_speed_10m: 10,
          precipitation: 0,
          surface_pressure: 1013,
          weather_code: 0,
        },
        daily: {
          time: ['2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'],
          temperature_2m_min: [15, 16, 17, 18, 19],
          temperature_2m_max: [20, 21, 22, 23, 24],
          precipitation_probability_max: [0, 10, 20, 30, 40],
          weather_code: [0, 1, 2, 3, 61],
        },
      }),
    });
  });

  await page.goto('/');
  await page.getByLabel('Buscar cidade').fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar' }).click();

  const cityResult = page.getByRole('button', { name: /São Paulo.*Brasil/ });
  await expect(cityResult).toBeVisible();
  await cityResult.click();

  await expect(page.getByRole('heading', { name: 'São Paulo' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Previsão de 5 dias' })).toBeVisible();
  const currentWeather = page.getByRole('region', { name: 'Clima atual em São Paulo' });
  await expect(currentWeather.getByText('20°C', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: '°F' }).click();

  await expect(currentWeather.getByText('68°F', { exact: true })).toBeVisible();
  expect(forecastRequests).toBe(1);
});

test('exibe estado vazio quando a busca não retorna cidades', async ({ page }) => {
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });

  await page.goto('/');
  await page.getByLabel('Buscar cidade').fill('Cidade inexistente');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('status')).toContainText('Nenhuma cidade encontrada.');
  await expect(page.getByRole('region', { name: /Clima atual/ })).toHaveCount(0);
});

test('exibe validação e não consulta para busca vazia', async ({ page }) => {
  let geocodingRequests = 0;
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    geocodingRequests += 1;
    await route.continue();
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('alert')).toHaveText('Digite o nome de uma cidade.');
  expect(geocodingRequests).toBe(0);
});

test('exibe validação e não consulta para busca com apenas espaços', async ({ page }) => {
  let geocodingRequests = 0;
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    geocodingRequests += 1;
    await route.continue();
  });

  await page.goto('/');
  await page.getByLabel('Buscar cidade').fill('   ');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('alert')).toHaveText('Digite o nome de uma cidade.');
  expect(geocodingRequests).toBe(0);
});

test('preserva acentos e caracteres especiais na busca', async ({ page }) => {
  let requestedName: string | null = null;
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    requestedName = new URL(route.request().url()).searchParams.get('name');
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ results: [] }),
    });
  });

  await page.goto('/');
  await page.getByLabel('Buscar cidade').fill('São Paulo & Co.');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('status')).toContainText('Nenhuma cidade encontrada.');
  expect(requestedName).toBe('São Paulo & Co.');
});

test('exibe erro quando o forecast vem incompleto', async ({ page }) => {
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        results: [
          {
            id: 3,
            name: 'Recife',
            latitude: -8.05,
            longitude: -34.9,
            country: 'Brasil',
            admin1: 'Pernambuco',
          },
        ],
      }),
    });
  });
  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ timezone: 'America/Recife', current: {} }),
    });
  });

  await page.goto('/');
  await page.getByLabel('Buscar cidade').fill('Recife');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await page.getByRole('button', { name: /Recife.*Brasil/ }).click();

  await expect(
    page.getByRole('alert').getByText('Dados indisponíveis no momento.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('region', { name: /Clima atual/ })).toHaveCount(0);
});

test.describe('fluxo principal em viewport mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('renderiza o clima da cidade buscada', async ({ page }) => {
    await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              id: 2,
              name: 'Curitiba',
              latitude: -25.43,
              longitude: -49.27,
              country: 'Brasil',
              country_code: 'BR',
              admin1: 'Paraná',
              timezone: 'America/Sao_Paulo',
            },
          ],
        }),
      });
    });

    await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          timezone: 'America/Sao_Paulo',
          current: {
            temperature_2m: 16,
            apparent_temperature: 15,
            relative_humidity_2m: 80,
            wind_speed_10m: 8,
            precipitation: 0,
            surface_pressure: 1015,
            weather_code: 3,
          },
          daily: {
            time: ['2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'],
            temperature_2m_min: [12, 13, 14, 15, 16],
            temperature_2m_max: [16, 17, 18, 19, 20],
            precipitation_probability_max: [40, 30, 20, 10, 0],
            weather_code: [3, 2, 1, 0, 61],
          },
        }),
      });
    });

    await page.goto('/');
    await page.getByLabel('Buscar cidade').fill('Curitiba');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await page.getByRole('button', { name: /Curitiba.*Brasil/ }).click();

    const currentWeather = page.getByRole('region', { name: 'Clima atual em Curitiba' });
    await expect(currentWeather).toBeVisible();
    await expect(currentWeather).toContainText('16°C');
    await expect(page.getByRole('heading', { name: 'Previsão de 5 dias' })).toBeVisible();
  });
});
