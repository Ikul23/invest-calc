import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchResults, exportPdf } from '../api';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ResultsPage = () => {
  const { project_id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchResults(project_id);
        console.log('API Response:', data); // Для отладки

        if (!data) {
          throw new Error('Сервер не вернул данные');
        }

        setResult(data);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setError(err.message || 'Произошла ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [project_id]);

  const handleDownloadPdf = async () => {
    if (!result) return;

    setPdfLoading(true);
    try {
      await exportPdf({
        project_name: result.project_name,
        cashFlows: result.cashflows || [],
        npv: result.project_metric?.npv || 0,
        irr: result.project_metric?.irr || 0,
        dpbp: result.project_metric?.dpbp || 0,
      });
    } catch (error) {
      console.error('Ошибка при экспорте PDF:', error);
      alert('Не удалось скачать PDF-файл');
    } finally {
      setPdfLoading(false);
    }
  };

  // Форматирование значений с проверкой
  const formatValue = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '—';
    }
    return typeof value === 'number'
      ? value.toLocaleString('ru-RU')
      : value;
  };

  // Проверка и подготовка данных для графика
  const getChartData = () => {
    if (!result?.cashflows || !Array.isArray(result.cashflows)) {
      return {
        labels: [],
        datasets: [{
          label: 'Денежный поток',
          data: [],
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.3)',
          fill: true,
          tension: 0.3,
        }]
      };
    }

    return {
      labels: result.cashflows.map((row) => `Год ${row.year || ''}`),
      datasets: [{
        label: 'Денежный поток',
        data: result.cashflows.map((row) => row.cashflow || 0),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.3)',
        fill: true,
        tension: 0.3,
      }]
    };
  };

  // Состояния загрузки и ошибок
  if (loading) {
    return <div className="container mt-5">Загрузка результатов...</div>;
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Ошибка: {error}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Нет данных для отображения
        </div>
      </div>
    );
  }

  // Проверка наличия необходимых данных
  const hasValidCashflows = Array.isArray(result.cashflows) && result.cashflows.length > 0;
  const hasMetrics = result.project_metric && (
    result.project_metric.npv !== undefined ||
    result.project_metric.irr !== undefined ||
    result.project_metric.dpbp !== undefined
  );

  const chartData = getChartData();
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Результаты по проекту: {result.project_name || 'Без названия'}</h2>

      {hasMetrics ? (
        <div className="row">
          <div className="col-md-4">
            <Card className="mb-3 shadow-sm">
              <CardBody>
                <CardTitle tag="h5">NPV</CardTitle>
                <CardText>{formatValue(result.project_metric.npv)} ₽</CardText>
              </CardBody>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="mb-3 shadow-sm">
              <CardBody>
                <CardTitle tag="h5">IRR</CardTitle>
                <CardText>
                  {result.project_metric.irr !== undefined
                    ? `${formatValue(result.project_metric.irr)} %`
                    : '—'}
                </CardText>
              </CardBody>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="mb-3 shadow-sm">
              <CardBody>
                <CardTitle tag="h5">DPBP</CardTitle>
                <CardText>
                  {result.project_metric.dpbp !== undefined
                    ? `${formatValue(result.project_metric.dpbp)} лет`
                    : '—'}
                </CardText>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning mb-4">
          Нет данных о финансовых показателях
        </div>
      )}

      {hasValidCashflows ? (
        <>
          <h4 className="mt-4">График денежных потоков:</h4>
          <div className="chart-container mb-5" style={{ height: '400px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>

          <h4 className="mt-4">Детализация денежных потоков:</h4>
          <div className="table-responsive">
            <table className="table table-bordered table-striped mt-2">
              <thead className="table-light">
                <tr>
                  <th>Год</th>
                  <th>Выручка</th>
                  <th>OPEX</th>
                  <th>CAPEX</th>
                  <th>Амортизация</th>
                  <th>EBT</th>
                  <th>Налог (25%)</th>
                  <th>Чистая прибыль</th>
                  <th>Δ Оборотный капитал</th>
                  <th>Чистый поток</th>
                </tr>
              </thead>
              <tbody>
                {result.cashflows.map((row, index) => (
                  <tr key={index}>
                    <td>{formatValue(row.year)}</td>
                    <td>{formatValue(row.revenue)} ₽</td>
                    <td>{formatValue(row.opex)} ₽</td>
                    <td>{formatValue(row.capex)} ₽</td>
                    <td>{formatValue(row.depreciation)} ₽</td>
                    <td>{formatValue(row.ebt)} ₽</td>
                    <td>{formatValue(row.tax)} ₽</td>
                    <td>{formatValue(row.net_profit)} ₽</td>
                    <td>{formatValue(row.working_capital)} ₽</td>
                    <td>{formatValue(row.cashflow)} ₽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="alert alert-warning">
          Нет данных о денежных потоках
        </div>
      )}

      <button
        className="btn btn-primary mt-4 mb-5"
        onClick={handleDownloadPdf}
        disabled={pdfLoading || !hasValidCashflows}
      >
        <i className="bi bi-file-earmark-pdf me-2"></i>
        {pdfLoading ? 'Генерация PDF...' : 'Скачать PDF отчет'}
      </button>
    </div>
  );
};

export default ResultsPage;
