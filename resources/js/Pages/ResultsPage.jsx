import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Alert,
  Spinner,
  Table,
  Button
} from 'reactstrap';
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
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

const loadData = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await fetchResults(project_id);

    if (!isMounted) return;

    // Проверяем, что имеем правильную структуру данных
    if (!response || !response.projectData) {
      throw new Error('Некорректный формат данных');
    }

    const data = response.projectData; // Получаем данные из вложенного объекта

    // Проверка обязательных полей
    if (!data.project_id || !data.project_name) {
      throw new Error('Отсутствуют обязательные данные');
    }

    // Нормализация данных
    const normalizedData = {
      ...data,
      cashflows: Array.isArray(data.cashflow) ? data.cashflow : [],
      metrics: data.metrics || {
        npv: 0,
        irr: 0,
        dpbp: 0,
        pp: 0
      },
      npv_data: data.npv_data || []
    };

        setResult(normalizedData);
      } catch (err) {
        if (!isMounted) return;
        console.error('Ошибка загрузки:', err);
        setError(err.message || 'Ошибка при загрузке данных');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [project_id, navigate]);

  const handleDownloadPdf = async () => {
    if (!result?.project_id) return;

    setPdfLoading(true);
    try {
      await exportPdf({ project_id: result.project_id });
    } catch (err) {
      setError('Ошибка генерации PDF: ' + (err.message || 'Неизвестная ошибка'));
    } finally {
      setPdfLoading(false);
    }
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '—';
    return typeof value === 'number'
      ? value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : value;
  };

  const getChartData = () => {
    if (!result?.cashflow || result.cashflow.length === 0) {
      return { labels: [], datasets: [] };
    }

    const npvData = result.npv_data.length > 0
      ? result.npv_data
      : result.cashflow.reduce((acc, item, index) => {
          const prev = acc[index - 1] || 0;
          return [...acc, prev + (item.npv || 0)];
        }, []);

    return {
      labels: result.cashflow.map(item => `Год ${item.year || '—'}`),
      datasets: [
        {
          label: 'Суммарные затраты (CAPEX + OPEX)',
          data: result.cashflow.map(item => (item.capex || 0) + (item.opex || 0)),
          borderColor: '#ff6384',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          yAxisID: 'y1',
        },
        {
          label: 'NPV (накопленный)',
          data: npvData,
          borderColor: '#36a2eb',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          yAxisID: 'y2',
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y || 0;
            return `${context.dataset.label}: ${value.toLocaleString('ru-RU')} ₽`;
          }
        }
      }
    },
    scales: {
      y1: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Суммарные затраты (₽)' }
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'NPV (₽)' },
        grid: { drawOnChartArea: false }
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 d-flex justify-content-center">
        <Spinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert color="danger">
          {error}
          <div className="mt-2">
            <Button
              color="primary"
              onClick={() => window.location.reload()}
            >
              Обновить страницу
            </Button>
            <Button
              color="secondary"
              onClick={() => navigate('/projects')}
              className="ms-2"
            >
              Вернуться к списку проектов
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mt-5">
        <Alert color="warning">
          Нет данных для отображения
          <Button
            color="primary"
            onClick={() => navigate('/projects')}
            className="ms-2"
          >
            Вернуться к списку проектов
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <h2 className="mb-4">Результаты: {result.project_name}</h2>

      <div className="row mb-4">
        <div className="col-md-3">
          <Card className="shadow-sm">
            <CardBody>
              <CardTitle tag="h5">NPV</CardTitle>
              <CardText>{formatValue(result.metrics.npv)} ₽</CardText>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="shadow-sm">
            <CardBody>
              <CardTitle tag="h5">IRR</CardTitle>
              <CardText>{formatValue(result.metrics.irr)}%</CardText>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="shadow-sm">
            <CardBody>
              <CardTitle tag="h5">DPBP</CardTitle>
              <CardText>{formatValue(result.metrics.dpbp)} лет</CardText>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="shadow-sm">
            <CardBody>
              <CardTitle tag="h5">PP</CardTitle>
              <CardText>{formatValue(result.metrics.pp)} лет</CardText>
            </CardBody>
          </Card>
        </div>
      </div>

      {result.cashflow.length > 0 && (
        <>
          <h4 className="mt-4">График денежных потоков</h4>
          <div className="chart-container mb-5" style={{ height: '400px' }}>
            <Line data={getChartData()} options={chartOptions} />
          </div>

          <h4 className="mt-4">Финансовые показатели</h4>
          <div className="table-responsive mb-4">
            <Table bordered striped>
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
                  <th>ЧОК</th>
                  <th>Денежный поток</th>
                  <th>NPV</th>
                </tr>
              </thead>
              <tbody>
                {result.cashflow.map((row, i) => (
                  <tr key={i}>
                    <td>{row.year || '—'}</td>
                    <td>{formatValue(row.revenue)} ₽</td>
                    <td>{formatValue(row.opex)} ₽</td>
                    <td>{formatValue(row.capex)} ₽</td>
                    <td>{formatValue(row.depreciation)} ₽</td>
                    <td>{formatValue(row.ebit)} ₽</td>
                    <td>{formatValue(row.tax)} ₽</td>
                    <td>{formatValue(row.net_income)} ₽</td>
                    <td>{formatValue(row.working_capital)} ₽</td>
                    <td>{formatValue(row.cashflow)} ₽</td>
                    <td>{formatValue(row.npv)} ₽</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}

      {result.cashflow.length === 0 && (
        <Alert color="info" className="mb-4">
          Нет данных о денежных потоках
        </Alert>
      )}

      <div className="mb-5">
        <Button
          color="primary"
          onClick={handleDownloadPdf}
          disabled={pdfLoading || result.cashflow.length === 0}
        >
          {pdfLoading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Генерация PDF...
            </>
          ) : (
            'Скачать отчет PDF'
          )}
        </Button>
        <Button
          color="secondary"
          onClick={() => navigate('/projects')}
          className="ms-2"
        >
          Вернуться к списку проектов
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;
