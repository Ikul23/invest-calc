import { Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import Footer from './Footer';

const PDFGallery = () => {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Массив PDF-документов
  const pdfFiles = [
    {
      id: 1,
      title: "Бизнес-план строительства завода",
      path: "/docs/bp_factory.pdf",
      previewImage: "/images/factory_bp_preview.jpg",
    },
    {
      id: 2,
      title: "Тизер проекта по строительству завода",
      path: "/docs/factory_teaser.pdf",
      previewImage: "/images/factory_teaser_preview.jpg",
    }
  ];

  // Полная блокировка всех действий с PDF
  const disableAll = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Container className="py-4 flex-grow-1">
        <h2 className="mb-4">Документы</h2>

        <Row xs={1} md={2} lg={3} className="g-4">
          {pdfFiles.map((pdf) => (
            <Col key={pdf.id}>
              <Card
                className="h-100 shadow-sm cursor-pointer"
                onClick={() => {
                  setSelectedPdf(pdf);
                  setShowModal(true);
                }}
              >
                <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                  <Card.Img
                    variant="top"
                    src={pdf.previewImage}
                    alt={`Превью ${pdf.title}`}
                    className="h-100 w-100 object-fit-cover"
                  />
                  <div className="position-absolute bottom-0 start-0 end-0 p-2 bg-dark bg-opacity-75 text-white">
                    <small>{pdf.title}</small>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="fs-6">{pdf.title}</Card.Title>
                  </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Модальное окно с максимальной защитой */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="xl"
          centered
          onContextMenu={disableAll}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedPdf?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body
            className="p-0 bg-light"
            style={{ height: '70vh' }}
            onContextMenu={disableAll}
          >
            {selectedPdf && (
              <div className="w-100 h-100 position-relative">
                <iframe
                  src={`${selectedPdf.path}#toolbar=0&navpanes=0&scrollbar=0&view=fitH`}
                  title={selectedPdf.title}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="border-0"
                  onContextMenu={disableAll}
                />
                {/* Невидимый слой для блокировки всех действий */}
                <div
                  className="position-absolute top-0 start-0 end-0 bottom-0"
                  onContextMenu={disableAll}
                  onClick={disableAll}
                  onDoubleClick={disableAll}
                  style={{
                    pointerEvents: 'none',
                    cursor: 'none'
                  }}
                />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <small className="text-muted">
              © {new Date().getFullYear()} Компания "ГИС+" | Просмотр только в режиме чтения
            </small>
          </Modal.Footer>
        </Modal>
      </Container>
     <Footer />
    </div>
  );
};

export default PDFGallery;
