import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaFilePdf, FaSpinner } from 'react-icons/fa';
import RentalHistoryPDF from './RentalHistoryPDF';

const PDFDownloadButton = ({ data, filename = "rental-history.pdf" }) => {
  const [isClient, setIsClient] = useState(false);

  // This ensures the component renders only on client-side
  // because PDFDownloadLink needs browser environment
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <button className="btn btn-danger" disabled>
        <FaSpinner className="me-2 fa-spin" />
        Preparing PDF...
      </button>
    );
  }

  return (
    <PDFDownloadLink 
      document={<RentalHistoryPDF rentals={data} />} 
      fileName={filename}
      className="btn btn-danger"
    >
      {({ blob, url, loading, error }) =>
        loading ? 
          <>
            <FaSpinner className="me-2 fa-spin" />
            Generating PDF...
          </> : 
          <>
            <FaFilePdf className="me-2" />
            Download History as PDF
          </>
      }
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;