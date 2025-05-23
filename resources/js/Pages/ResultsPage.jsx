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
import Footer from '../Pages/Footer';
import { FINANCE_CONSTANTS } from '../constants';
import { useTranslation } from 'react-i18next';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);


const ResultsPage = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  const { project_id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isProjectUnprofitable, setIsProjectUnprofitable] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchResults(project_id);

        if (!isMounted) return;

        if (!response || !response.projectData) {
          throw new Error('Некорректный формат данных');
        }

        const data = response.projectData;

        if (!data.project_id || !data.project_name) {
          throw new Error('Отсутствуют обязательные данные');
        }

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

        // Проверка окупаемости проекта
        const isNpvNegative = normalizedData.metrics.npv < 0;
        const isIrrLessThanDiscountRate = normalizedData.metrics.irr < FINANCE_CONSTANTS.DISCOUNT_RATE;
        setIsProjectUnprofitable(isNpvNegative || isIrrLessThanDiscountRate);

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
      const response = await exportPdf({ project_id: result.project_id });

      // Создаем blob из ответа
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Создаем временную ссылку для скачивания
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${result.project_name}_report.pdf`);
      document.body.appendChild(link);
      link.click();

      // Очистка
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

    } catch (err) {
      console.error('PDF Export Error:', err);
      setError(`Ошибка генерации PDF: ${err.message || 'Неизвестная ошибка'}`);
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

  const getNpvChartData = () => {
    if (!result?.cashflow || !Array.isArray(result.cashflow)) {
      return { labels: [], datasets: [] };
    }

    const years = result.cashflow.map(item => item.year);
    const npvData = result.npv_data?.length > 0
      ? result.npv_data
      : result.cashflow.map(item => item.npv || 0);

    return {
      labels: years,
      datasets: [
        {
          label: t('title_chart'),
          data: npvData,
          borderColor: '#36A2EB',
          backgroundColor: function(context) {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(54, 162, 235, 0.8)');
            gradient.addColorStop(1, 'rgba(54, 162, 235, 0.1)');
            return gradient;
          },
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const npvChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: t('yAxis'),
          font: {
            weight: 'bold'
          }
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('ru-RU').format(value);
          }
        },
        grid: {
          color: function(context) {
            return context.tick.value === 0 ? '#FF0000' : '#E0E0E0';
          },
          lineWidth: function(context) {
            return context.tick.value === 0 ? 2 : 1;
          }
        }
      },
      x: {
        title: {
          display: true,
          text: t('xAxis'),
          font: {
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${new Intl.NumberFormat('ru-RU').format(context.parsed.y)} руб`;
          }
        }
      },
      legend: {
        display: false
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
              {t("refresh")}
            </Button>
            <Button
              color="secondary"
              onClick={() => navigate('/projects')}
              className="ms-2"
            >
              {t('backToProjects')}
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
            {t('backToProjects')}
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container mt-3 flex-grow-1">
        <h2 className="mb-4">{t("title_result")} {result.project_name}</h2>


        {isProjectUnprofitable && (
          <Alert color="warning" className="mb-4">
            <strong>{t("warning_message")} </strong>
          </Alert>
        )}

        <div className="row mb-4">
          <div className="col-md-3">
            <Card className="shadow-sm">
              <CardBody>
                <CardTitle tag="h5">{t("npv")}</CardTitle>
                <CardText>{formatValue(result.metrics.npv)} ₽</CardText>
              </CardBody>
            </Card>
          </div>
          <div className="col-md-3">
            <Card className="shadow-sm">
              <CardBody>
                <CardTitle tag="h5">{t("irr")}</CardTitle>
                <CardText>{formatValue(result.metrics.irr)}%</CardText>
              </CardBody>
            </Card>
          </div>
          <div className="col-md-3">
            <Card className="shadow-sm">
              <CardBody>
                <CardTitle tag="h5">{t("dpbp")}</CardTitle>
                <CardText>{formatValue(result.metrics.dpbp)} лет</CardText>
              </CardBody>
            </Card>
          </div>
          <div className="col-md-3">
            <Card className="shadow-sm">
              <CardBody>
                <CardTitle tag="h5">{t("discountRate")}</CardTitle>
                <CardText>{FINANCE_CONSTANTS.DISCOUNT_RATE}%</CardText>
              </CardBody>
            </Card>
          </div>
        </div>


        <div className="mb-5">
          <h4 className="mb-3">{t("title_chart")}</h4>
          <div style={{ height: '500px', position: 'relative' }}>
            <Line
              data={getNpvChartData()}
              options={npvChartOptions}
            />
          </div>
        </div>

        {result.cashflow.length > 0 && (
          <>
            <h4 className="mt-4">{t("title_table")}</h4>
            <div className="table-responsive mb-4">
              <Table bordered striped>
                <thead className="table-light">
                  <tr>
                    <th>{t("year")}</th>
                    <th>{t("revenue")}</th>
                    <th>{t("opex")}</th>
                    <th>{t("capex")}</th>
                    <th>{t("depreciation")}</th>
                    <th>{t("ebt")}</th>
                    <th>{t("tax")}</th>
                    <th>{t("netIncome")}</th>
                    <th>{t("workingCapital")}</th>
                    <th>{t("cashflow")}</th>
                    <th>{t("npv_table")}</th>
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
                {t("generatingPdf")}
              </>
            ) : (
              t('downloadPdf')
            )}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResultsPage;
