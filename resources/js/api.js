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
    const response = await api.post('/export-pdf', data, {
      responseType: 'blob',
    });

    // Создаем временную ссылку для скачивания
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.project_name}_report.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};
