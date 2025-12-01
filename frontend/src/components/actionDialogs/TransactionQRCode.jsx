import { useEffect, useState } from 'react';
import QRCode from "qrcode";
import Alert from "@mui/material/Alert";

/**
 * Component responsible for generating and displaying the QR code for a single
 * unprocessed redemption transaction.
 */
export function TransactionQRCode({ transaction }) {
    const [qrDataUrl, setQrDataUrl] = useState(null);
    const [error, setError] = useState(null);
    
    // exist and be a redemption
    if (!transaction || transaction.type !== 'redemption') {
        return null; 
    }
    
    //  be unprocessed
    if (transaction.processed) {
        return null;
    }
    
    // qr code
    useEffect(() => {
        const qrData = `redeema://transaction/${transaction.id}`;

        QRCode.toDataURL(qrData, {
            errorCorrectionLevel: "H",
            width: 100, //may need to fix sizing later depending on details page layout
            height: 100,
        })
        .then(setQrDataUrl)
        .catch((err) => {
            console.error("Failed to generate QR code:", err);
            setError("Failed to generate QR code image.");
        });
    }, [transaction.id]);

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }
    
    return (
        <div className="qrcode-container" style={{ textAlign: 'center' }}>
            <h4>Show this QR Code to the Cashier</h4>
            {qrDataUrl ? (
                <img src={qrDataUrl} alt={`QR Code for Transaction ${transaction.id}`} />
            ) : (
                <p>Generating QR code...</p>
            )}
            <p>Pending Redemption: {transaction.amount} Points</p>
        </div>
    );
}