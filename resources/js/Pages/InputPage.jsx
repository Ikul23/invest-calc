import { useState } from 'react';
import axios from 'axios';
import Footer from '../Pages/Footer';

export default function InputPage() {
  const [projectName, setProjectName] = useState('');
  const [financialData, setFinancialData] = useState([
    { year: '', opex: '', capex: '', revenue: '' },
  ]);
  const [message, setMessage] = useState('');

  const handleAddRow = () => {
    setFinancialData([...financialData, { year: '', opex: '', capex: '', revenue: '' }]);
  };

  const handleRemoveRow = (index) => {
    if (financialData.length > 1) {
      const updatedData = financialData.filter((_, i) => i !== index);
      setFinancialData(updatedData);
    }
  };

  const handleChange = (index, field, value) => {
    const updatedData = [...financialData];
    updatedData[index][field] = value === '' ? '' : Number(value);
    setFinancialData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // Валидация перед отправкой
      const hasEmptyFields = financialData.some(row =>
        Object.values(row).some(val => val === '')
      );

      if (!projectName || hasEmptyFields) {
        throw new Error('Заполните все обязательные поля');
      }

      // Преобразование данных перед отправкой
      const requestData = {
        project_name: projectName,
        financial_data: financialData.map(row => ({
          year: Number(row.year),
          opex: Number(row.opex),
          capex: Number(row.capex),
          revenue: Number(row.revenue)
        }))
      };

      const response = await axios.post('/api/input-data', requestData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setMessage(response.data.message || 'Данные успешно сохранены');

      // Очистка формы после успешного сохранения
      setProjectName('');
      setFinancialData([{ year: '', opex: '', capex: '', revenue: '' }]);

    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      setMessage(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Ошибка при сохранении данных'
      );
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container mt-5 flex-grow-1">
        <h1 className="mb-4">Ввод данных проекта</h1>

        {message && (
          <div className={`alert ${message.includes('успешно') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Основная информация</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Название проекта *</label>
                <input
                  type="text"
                  className="form-control"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Финансовые показатели</h5>
            </div>
            <div className="card-body">
              {financialData.map((row, index) => (
                <div key={index} className="row g-3 mb-3 align-items-center">
                  <div className="col-md-2">
                    <input
                      type="number"
                      placeholder="Год"
                      className="form-control"
                      value={row.year}
                      onChange={(e) => handleChange(index, 'year', e.target.value)}
                      min="2000"
                      max="2100"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      placeholder="CAPEX"
                      className="form-control"
                      value={row.capex}
                      onChange={(e) => handleChange(index, 'capex', e.target.value)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      placeholder="OPEX"
                      className="form-control"
                      value={row.opex}
                      onChange={(e) => handleChange(index, 'opex', e.target.value)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      placeholder="Revenue"
                      className="form-control"
                      value={row.revenue}
                      onChange={(e) => handleChange(index, 'revenue', e.target.value)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-md-1">
                    {financialData.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleRemoveRow(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="d-flex gap-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddRow}
                >
                  + Добавить год
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary btn-lg">
              Сохранить данные
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
