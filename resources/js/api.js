import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export const fetchResults = async (project_id) => {
  try {
    const response = await api.get(`/results/${project_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
};

export const sendData = async (data) => {
  try {
    const response = await api.post('/input-data', data);
    console.log('Успешно отправлено:', response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке данных:', error);
    throw error;
  }
};

export const exportPdf = async (data) => {
  try {
    const response = await api.post(
      '/export-pdf',
      data,
      {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      }
    );

    if (!response.data || response.data.size === 0) {
      throw new Error('Получен пустой PDF файл');
    }

    return response;
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
};
