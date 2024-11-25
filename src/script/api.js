const BASE_URL = 'https://example.com/api';

const ENDPOINT = {
  predict: `${BASE_URL}/predict`,
};

class PredictAPI {
  static async predict(data) {
    const response = await fetch(ENDPOINT.predict, {
      method: 'POST',
      body: data,
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch prediction');
    }

    const json = await response.json();
    return json;
  }
}
