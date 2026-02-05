
import { useApiObtenerDashboardQuery } from '../../../api/apiSlice';
import { FaMoneyBillWave, FaShoppingCart, FaChartLine, FaExclamationTriangle, FaBoxOpen, FaClock } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';

const Dashboard = () => {
    const { data, error, isLoading } = useApiObtenerDashboardQuery();

    if (isLoading) return <div className="p-10 text-center text-gray-500">Cargando dashboard...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error al cargar datos del dashboard</div>;

    // Si no hay datos, usamos valores por defecto seguros
    const resumen = data?.resumen || { totalVentasDia: 0, cantidadVentasDia: 0, totalVentasMes: 0, productosBajoStock: 0 };
    const ventasSemana = data?.ventasUltimos7Dias || [];
    const topProductos = data?.productosMasVendidos || [];
    const ultimasVentas = data?.ultimasVentas || [];

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {/* SECCIÓN 1: TARJETAS DE RESUMEN (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Ventas del Día */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Ventas Hoy</p>
                        <p className="text-2xl font-bold text-gray-800">S/ {resumen.totalVentasDia.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                        <FaMoneyBillWave size={24} />
                    </div>
                </div>

                {/* Cantidad de Ventas */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Transacciones</p>
                        <p className="text-2xl font-bold text-gray-800">{resumen.cantidadVentasDia}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <FaShoppingCart size={24} />
                    </div>
                </div>

                {/* Proyección Mensual */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Acumulado Mes</p>
                        <p className="text-2xl font-bold text-gray-800">S/ {resumen.totalVentasMes.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                        <FaChartLine size={24} />
                    </div>
                </div>

                {/* Alerta de Stock */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Bajo Stock</p>
                        <p className="text-2xl font-bold text-red-600">{resumen.productosBajoStock}</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-full text-red-600">
                        <FaExclamationTriangle size={24} />
                    </div>
                </div>
            </div>

            {/* SECCIÓN 2: GRÁFICO E INFORMACIÓN LATERAL */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Gráfico de Ventas Semanal */}
                <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Ventas Últimos 7 Días</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ventasSemana}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="fecha"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(val: any) => new Date(val).toLocaleDateString('es-PE', { weekday: 'short' })}
                                />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => [`S/ ${value}`, 'Venta Total']}
                                    labelFormatter={(label: any) => new Date(label).toLocaleDateString()}
                                />
                                <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Productos */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <FaBoxOpen className="mr-2 text-primary" /> Top Productos
                    </h2>
                    <div className="space-y-4">
                        {topProductos.length > 0 ? topProductos.map((prod, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                                <span className="text-sm font-medium text-gray-700 truncate w-2/3" title={prod.nombre}>
                                    {idx + 1}. {prod.nombre}
                                </span>
                                <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600">
                                    {prod.cantidad} und.
                                </span>
                            </div>
                        )) : (
                            <p className="text-gray-400 text-sm">No hay datos suficientes.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* SECCIÓN 3: ÚLTIMAS VENTAS */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaClock className="mr-2 text-primary" /> Actividad Reciente
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="p-3 font-semibold">Hora</th>
                                <th className="p-3 font-semibold">Cliente</th>
                                <th className="p-3 font-semibold">Estado</th>
                                <th className="p-3 font-semibold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {ultimasVentas.map((venta) => (
                                <tr key={venta.id} className="hover:bg-gray-50 text-sm">
                                    <td className="p-3 text-gray-600">{venta.hora}</td>
                                    <td className="p-3 font-medium text-gray-800">{venta.cliente}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${venta.estado === 'FACTURADO' ? 'bg-green-100 text-green-700' :
                                            venta.estado === 'ANULADO' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {venta.estado}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right font-bold text-gray-700">S/ {Number(venta.total).toFixed(2)}</td>
                                </tr>
                            ))}
                            {ultimasVentas.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-400">No hay ventas recientes.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;