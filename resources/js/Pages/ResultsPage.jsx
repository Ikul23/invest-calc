import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Footer from './Footer';
import axios from 'axios';
import { useParams } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ResultsPage() {
  const { projectId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const PDF_URL = `/api/pdf/${projectId}`; // ссылка на PDF, поправь при необходимости

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`/api/projects/${projectId}/results`);
        setResults(res.data);
      } catch (err) {
        setError('Ошибка при загрузке результатов');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [projectId]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p>Загрузка...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  const chartData = {
    labels: results.cashflow.map((item) => item.year),
    datasets: [
      {
        label: 'Cash Flow',
        data: results.cashflow.map((item) => item.value),
        fill: false,
        backgroundColor: '#198754',
        borderColor: '#198754',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'График движения денежных средств' },
    },
  };

  return (
    <>
      <Container className="my-5">
        <h2 className="mb-4 text-center">Результаты расчёта</h2>

        {/* Метрики */}
        <Row className="mb-4">
          <Col md={3}>
            <Card bg="success" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>NPV</Card.Title>
                <Card.Text>{results.metrics.npv.toLocaleString()} ₽</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="info" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>IRR</Card.Title>
                <Card.Text>{results.metrics.irr.toFixed(2)}%</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="warning" text="dark" className="mb-3">
              <Card.Body>
                <Card.Title>DPBP</Card.Title>
                <Card.Text>{results.metrics.dpbp} лет</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="dark" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Discount Rate</Card.Title>
                <Card.Text>{results.metrics.discountRate}%</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Таблица */}
        <h4 className="mt-5 mb-3">Таблица движения денежных средств</h4>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Год</th>
              <th>Выручка</th>
              <th>CAPEX</th>
              <th>OPEX</th>
              <th>Cash Flow</th>
            </tr>
          </thead>
          <tbody>
            {results.cashflow.map((item) => (
              <tr key={item.year}>
                <td>{item.year}</td>
                <td>{item.revenue.toLocaleString()}</td>
                <td>{item.capex.toLocaleString()}</td>
                <td>{item.opex.toLocaleString()}</td>
                <td>{item.value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* График */}
        <div className="my-5">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* PDF preview и кнопка */}
        <div className="text-center my-5">
          <h4 className="mb-3">Предварительный просмотр PDF-отчёта</h4>
          <iframe
            src={`${PDF_URL}#toolbar=0`}
            title="PDF Preview"
            width="100%"
            height="600px"
            style={{ border: '1px solid #ccc', borderRadius: '8px', marginBottom: '1rem' }}
          ></iframe>

          <a href={PDF_URL} target="_blank" rel="noopener noreferrer" download>
            <Button variant="success">Скачать PDF</Button>
          </a>
        </div>
      </Container>

      <Footer />
    </>
  );
}
