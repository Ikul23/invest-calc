// Pages/GalleryPage.jsx
import { Container, Row, Col, Image } from 'react-bootstrap';

const GalleryPage = () => {
  // Массив с путями к изображениям (можно заменить на данные из API)
  const images = [
    '/images/sample1.jpg',
    '/images/sample2.jpg',
    '/images/sample3.jpg',
    // Добавьте больше изображений
  ];

  return (
    <Container>
      <h2 className="mb-4">Примеры работ</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {images.map((img, index) => (
          <Col key={index}>
            <Image
              src={img}
              alt={`Пример работы ${index + 1}`}
              thumbnail
              fluid
              className="gallery-image"
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default GalleryPage;
