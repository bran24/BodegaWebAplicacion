import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

export const generateInvoicePDF = async (venta: any) => {
    const doc = new jsPDF();

    // 1. Cabecera de la Empresa
    // Logo
    try {
        // Usamos la ruta configurada
        const img = await loadImage(COMPANY_INFO.logo);

        // Agregar imagen (x, y, ancho, alto)
        // El logo se coloca a la izquierda
        doc.addImage(img, 'PNG', 14, 15, 30, 30); // 30x30 logo

        // Ajustar texto a la derecha del logo (x = 50)
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(COMPANY_INFO.nombre, 50, 25);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`RUC: ${COMPANY_INFO.ruc}`, 50, 31);
        doc.text(`Dirección: ${COMPANY_INFO.direccion}`, 50, 36);
        doc.text(`Teléfono: ${COMPANY_INFO.telefono}`, 50, 41);
    } catch (e) {
        console.warn("No se pudo cargar el logo", e);
        // Fallback si no carga la imagen, texto normal
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(COMPANY_INFO.nombre, 14, 20);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`RUC: ${COMPANY_INFO.ruc}`, 14, 26);
        doc.text(`Dirección: ${COMPANY_INFO.direccion}`, 14, 31);
        doc.text(`Teléfono: ${COMPANY_INFO.telefono}`, 14, 36);
    }

    // 2. Información del Comprobante (Cuadro derecho)
    // Dibujar un rectángulo redondeado para el comprobante
    doc.setDrawColor(200);
    doc.roundedRect(130, 10, 70, 30, 2, 2, 'S');

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    // Centrar texto dentro del cuadro
    doc.text(`RUC ${COMPANY_INFO.ruc}`, 165, 18, { align: 'center' });

    doc.setFillColor(240, 240, 240); // Fondo gris claro para el tipo de comprobante
    doc.rect(131, 21, 68, 8, 'F');

    doc.setFontSize(10);
    doc.text(`${venta.tipo_comprobante?.nombre.toUpperCase() || 'COMPROBANTE'}`, 165, 26, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`${venta.serie}-${venta.numero}`, 165, 34, { align: 'center' });

    // 3. Información del Cliente
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text('Fecha Emisión:', 14, 50);
    doc.text('Cliente:', 14, 56);

    doc.setFont("helvetica", "normal");
    doc.text(new Date(venta.fecha_venta).toLocaleDateString(), 45, 50);
    doc.text(venta.cliente?.nombre || 'Cliente General', 45, 56);

    // 4. Tabla de Productos
    const tableColumn = ["Item", "Producto", "Cant.", "P. Unit", "Total"];
    const tableRows: any[] = [];

    venta.detalleVentas?.forEach((det: any, index: number) => {
        const row = [
            index + 1,
            det.producto?.nombre,
            det.cantidad,
            `S/ ${Number(det.precio_unitario).toFixed(2)}`,
            `S/ ${Number(det.total).toFixed(2)}`,
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
            0: { halign: 'center', cellWidth: 15 }, // Item
            2: { halign: 'center', cellWidth: 20 }, // Cant
            3: { halign: 'right', cellWidth: 25 },  // Precio
            4: { halign: 'right', cellWidth: 25 },  // Total
        },
    });

    // 5. Totales
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text('OP. GRAVADA:', 140, finalY);
    doc.text('IGV (18%):', 140, finalY + 6);
    doc.text('IMPORTE TOTAL:', 140, finalY + 14);

    doc.setFont("helvetica", "normal");
    // Calcular base imponible simple asumiendo IGV incluido en total o del JSON si viene desglosado
    // El JSON trae 'subtotal', 'igv', 'total' por item. 
    // Si venta.total_impuestos existe úsalo, si no, calcúlalo o usa el total.
    // Usaremos el total directo para simplificar si no hay desglose global en el JSON raiz (parece que solo hay 'total')

    // Suponiendo desglose simple basado en total si no hay datos exactos, pero visualmente:
    const total = Number(venta.total);
    const subtotal = total / 1.18;
    const igv = total - subtotal;

    doc.text(`S/ ${subtotal.toFixed(2)}`, 190, finalY, { align: 'right' });
    doc.text(`S/ ${igv.toFixed(2)}`, 190, finalY + 6, { align: 'right' });
    doc.setFont("helvetica", "bold");
    doc.text(`S/ ${total.toFixed(2)}`, 190, finalY + 14, { align: 'right' });

    // 6. Pie de página
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Gracias por su compra', 105, pageHeight - 10, { align: 'center' });

    // Guardar
    doc.save(`Comprobante_${venta.serie}-${venta.numero}.pdf`);
};
