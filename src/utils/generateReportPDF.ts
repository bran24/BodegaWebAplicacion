import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IngresoReporte } from '../api/types';
import { COMPANY_INFO } from '../config';

const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
    });
};

export const generateReportPDF = async (
    ingresos: IngresoReporte[],
    filtros: { fechaInicio?: string, fechaFin?: string, metodoPagoNombre?: string }
) => {
    const doc = new jsPDF();

    // 1. Logo y Cabecera
    try {
        const logoUrl = new URL(COMPANY_INFO.logo, import.meta.url).href;
        const img = await loadImage(logoUrl);
        doc.addImage(img, 'PNG', 14, 10, 20, 20);
    } catch (e) {
        console.warn("No se pudo cargar el logo", e);
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text('REPORTE DE INGRESOS', 40, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${new Date().toLocaleString()}`, 40, 26);

    // 2. Filtros Aplicados
    doc.setDrawColor(200);
    doc.setFillColor(250, 250, 250);
    doc.rect(14, 35, 180, 25, 'FD'); // Caja de filtros

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text('Filtros Aplicados:', 18, 42);

    doc.setFont("helvetica", "normal");
    let filterTextY = 50;

    const fInicio = filtros.fechaInicio ? new Date(filtros.fechaInicio).toLocaleDateString() : '----';
    const fFin = filtros.fechaFin ? new Date(filtros.fechaFin).toLocaleDateString() : '----';
    const mPago = filtros.metodoPagoNombre || 'Todos';

    doc.text(`• Fecha Inicio: ${fInicio}`, 25, filterTextY);
    doc.text(`• Fecha Fin: ${fFin}`, 90, filterTextY);
    doc.text(`• Método Pago: ${mPago}`, 145, filterTextY);

    // 3. Tabla de Datos
    const tableColumn = ["N°", "Método de Pago", "Fecha y Hora", "Total (S/.)"];
    const tableRows: any[] = [];
    let grandTotal = 0;

    ingresos.forEach((ing, index) => {
        const total = Number(ing.total);
        grandTotal += total;

        const row = [
            index + 1,
            ing.metodoNombre,
            new Date(ing.fecha).toLocaleString('es-PE'),
            total.toFixed(2)
        ];
        tableRows.push(row);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 65,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign: 'center' },
        columnStyles: {
            0: { halign: 'center', cellWidth: 15 },
            2: { halign: 'center' }, // Fecha
            3: { halign: 'right' },  // Total
        },
    });

    // 4. Total Final
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL REPORTADO:`, 130, finalY);
    doc.text(`S/ ${grandTotal.toFixed(2)}`, 190, finalY, { align: 'right' });

    // Pie de página
    const pageCount = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Página ${i} de ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    doc.save(`Reporte_Ingresos_${new Date().getTime()}.pdf`);
};
