import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ResultsPage = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('calculationResult');
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  const handleDownloadPdf = async () => {
    try {
      const response = await axios.post('/api/export-pdf', result, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${result.project_name}_report.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Ошибка при экспорте PDF:', error);
      alert('Не удалось скачать PDF-файл');
    }
  };

  if (!result) return <div className="container mt-5">Загрузка результатов...</div>;

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
      <Line data={chartData} options={chartOptions} className="mb-5" />

      <h4 className="mt-4">Денежные потоки:</h4>
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
              <td>{row.revenue.toLocaleString()}</td>
              <td>{row.opex.toLocaleString()}</td>
              <td>{row.capex.toLocaleString()}</td>
              <td>{row.ebt.toLocaleString()}</td>
              <td>{row.tax.toLocaleString()}</td>
              <td>{row.cashflow.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-primary mt-4" onClick={handleDownloadPdf}>
        Скачать PDF
      </button>
    </div>
  );
};

export default ResultsPage;
