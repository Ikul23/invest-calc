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
  const { projectName } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchResults(projectName);
        setResult(data);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка загрузки:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectName]);

  const handleDownloadPdf = async () => {
    try {
      await exportPdf({
        project_name: result.project_name,
        cashFlows: result.cashflow,
        npv: result.metrics.npv,
        irr: result.metrics.irr,
        dpbp: result.metrics.dpbp
      });
    } catch (error) {
      console.error('Ошибка при экспорте PDF:', error);
      alert('Не удалось скачать PDF-файл');
    }
  };

  if (loading) return <div className="container mt-5">Загрузка результатов...</div>;
  if (error) return <div className="container mt-5">Ошибка: {error}</div>;
  if (!result) return <div className="container mt-5">Нет данных для отображения</div>;

  const chartData = {
    labels: result.cashflow.map((row) => `Год ${row.year}`),
    datasets: [
      {
        label: 'Денежный поток',
        data: result.cashflow.map((row) => row.cashflow),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.3)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

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
      <h2 className="mb-4">Результаты по проекту: {result.project_name}</h2>

      <div className="row">
        <div className="col-md-4">
          <Card className="mb-3 shadow-sm">
            <CardBody>
              <CardTitle tag="h5">NPV</CardTitle>
              <CardText>{result.metrics.npv.toLocaleString()} ₽</CardText>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="mb-3 shadow-sm">
            <CardBody>
              <CardTitle tag="h5">IRR</CardTitle>
              <CardText>{result.metrics.irr} %</CardText>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="mb-3 shadow-sm">
            <CardBody>
              <CardTitle tag="h5">DPBP</CardTitle>
              <CardText>{result.metrics.dpbp} лет</CardText>
            </CardBody>
          </Card>
        </div>
      </div>

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
              <th>EBT</th>
              <th>Налог (25%)</th>
              <th>Чистый поток</th>
            </tr>
          </thead>
          <tbody>
            {result.cashflow.map((row, index) => (
              <tr key={index}>
                <td>{row.year}</td>
                <td>{row.revenue.toLocaleString()} ₽</td>
                <td>{row.opex.toLocaleString()} ₽</td>
                <td>{row.capex.toLocaleString()} ₽</td>
                <td>{row.ebt.toLocaleString()} ₽</td>
                <td>{row.tax.toLocaleString()} ₽</td>
                <td>{row.cashflow.toLocaleString()} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="btn btn-primary mt-4 mb-5"
        onClick={handleDownloadPdf}
      >
        <i className="bi bi-file-earmark-pdf me-2"></i> Скачать PDF отчет
      </button>
    </div>
  );
};

export default ResultsPage;
