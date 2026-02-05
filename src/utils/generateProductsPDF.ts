import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Product } from '../api/types';
import { COMPANY_INFO } from '../config';


interface ProductPDFOptions {
    categoria?: string;
    proveedor?: string;
    query?: string;
    fechaVencimiento?: string;
}

const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.crossOrigin = "Anonymous"; // Necesario si la imagen es de otro dominio
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
};

export const generateProductsPDF = async (products: Product[], options?: ProductPDFOptions) => {
    const doc = new jsPDF();

    // Cargar Logo
    try {
        const logo = await loadImage(COMPANY_INFO.logo); // Usa una ruta absoluta si está en public o una URL
        doc.addImage(logo, 'PNG', 14, 10, 20, 20); // x, y, ancho, alto
    } catch (error) {
        console.warn('No se pudo cargar el logo:', error);
    }
    const title = "REPORTE DE PRODUCTOS";
    const date = new Date().toLocaleDateString();

    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(title);
    const x = (pageWidth - textWidth) / 2;

    doc.setFontSize(16);
    doc.text(title, x, 20);

    doc.setFontSize(10);
    // doc.text(COMPANY_INFO.nombre, x, 26, { align: 'center' }); // Subtítulo con nombre de empresa

    doc.setFontSize(10);
    doc.text(`Fecha: ${date}`, pageWidth - 40, 20);

    // Filtros aplicados
    let yPosition = 35;
    if (options) {
        doc.setFontSize(9);
        doc.setTextColor(100);
        let filterText = "Filtros aplicados: ";
        if (options.query) filterText += `Busqueda: ${options.query} | `;
        if (options.categoria) filterText += `Categoria: ${options.categoria} | `;
        if (options.proveedor) filterText += `Proveedor: ${options.proveedor} | `;
        if (options.fechaVencimiento) filterText += `Vencimiento: ${options.fechaVencimiento} | `;

        doc.text(filterText, 14, yPosition);
        yPosition += 5;
    }
    else {
        doc.text("---", 14, yPosition);
        yPosition += 5;
    }

    const tableColumn = ["ID", "Nombre", "SKU", "Categoría", "Proveedor", "Unidad", "P.Compra", "P.Venta", "Stock", "Vencimiento"];
    const tableRows: any[] = [];

    products.forEach(product => {
        const productData = [
            product.id,
            product.nombre,
            product.sku || '-',
            product.categoria?.nombre || '-',
            product.proveedor?.nombre || '-',
            product.unidad?.abreviatura || '-',
            product.precioCompra,
            product.precioVenta,
            product.cantidad,
            product.fechaVencimiento ? new Date(product.fechaVencimiento).toLocaleDateString() : '-',
        ];
        tableRows.push(productData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: yPosition,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 163, 74] }, // Verde similar al de la app

        // Colorear filas de stock crítico
        didParseCell: function (data) {
            if (data.section === 'body' && data.column.index === 8) { // Indice de columna Stock
                const stock = parseInt(data.cell.raw as string);
                if (stock < 10) {
                    data.cell.styles.textColor = [220, 38, 38]; // Rojo
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        }
    });

    const fileName = `Reporte_Productos_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
};
