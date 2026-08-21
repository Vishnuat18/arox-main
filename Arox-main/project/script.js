document.addEventListener('DOMContentLoaded', () => {
    // Initialize QR Code
    const qrContainer = document.getElementById('qr-code');
    new QRCode(qrContainer, {
        text: "https://arox.tech/certificate-verify",
        width: 70,
        height: 70,
        colorDark: "#0b1c3b",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    const preloader = document.getElementById('preloader');
    const certificate = document.getElementById('certificate');
    const downloadImgBtn = document.getElementById('download-img-btn');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const printBtn = document.getElementById('print-btn');

    // Input syncing logic
    const syncInput = (inputId, targetId) => {
        const input = document.getElementById(inputId);
        const target = document.getElementById(targetId);

        if (input && target) {
            input.addEventListener('input', (e) => {
                target.textContent = e.target.value;
            });
        }
    };

    syncInput('cert-id-input', 'cert-id-val');
    syncInput('issue-date-input', 'cert-issue-date-val');
    syncInput('name-input', 'cert-name-val');
    syncInput('project-input', 'cert-project-val');
    syncInput('start-date-input', 'cert-start-date-val');
    syncInput('end-date-input', 'cert-end-date-val');

    // Helper: Show/Hide preloader
    const togglePreloader = (show) => {
        if (show) {
            preloader.classList.remove('hidden');
        } else {
            preloader.classList.add('hidden');
        }
    };

    const generateCanvas = async () => {
        // Temporarily remove transform to ensure high-quality capture
        const originalTransform = certificate.style.transform;
        certificate.style.transform = 'none';

        const canvas = await html2canvas(certificate, {
            scale: 2, // Higher resolution for better quality
            useCORS: true,
            backgroundColor: null
        });

        // Restore transform
        certificate.style.transform = originalTransform;
        return canvas;
    };

    downloadImgBtn.addEventListener('click', async () => {
        togglePreloader(true);
        try {
            // Small delay to allow UI to show preloader before thread is blocked
            await new Promise(resolve => setTimeout(resolve, 50));

            const canvas = await generateCanvas();
            const link = document.createElement('a');
            link.download = 'Arox-Certificate.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error("Error generating image", error);
            alert("There was an error generating the image. Please try again.");
        } finally {
            togglePreloader(false);
        }
    });

    downloadPdfBtn.addEventListener('click', async () => {
        togglePreloader(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 50));

            const canvas = await generateCanvas();
            const imgData = canvas.toDataURL('image/png');

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Arox-Certificate.pdf');
        } catch (error) {
            console.error("Error generating PDF", error);
            alert("There was an error generating the PDF. Please try again.");
        } finally {
            togglePreloader(false);
        }
    });

    printBtn.addEventListener('click', () => {
        window.print();
    });
});
