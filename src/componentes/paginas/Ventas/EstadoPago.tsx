import { useSearchParams, Link } from 'react-router-dom';
type PaymentStatusType = 'approved' | 'rejected' | 'pending';
const EstadoPago = () => {
    const [searchParams] = useSearchParams();
    
    // 2. Obtenemos el status y le damos un valor por defecto si es null
    const status = (searchParams.get('status') || 'pending') as PaymentStatusType;
    const paymentId = searchParams.get('payment_id');
    // 3. Tipamos el objeto config
    const config: Record<PaymentStatusType, { icon: string; title: string; text: string; color: string }> = {
        approved: {
            icon: "✅",
            title: "¡Pago Exitoso!",
            text: "Tu pedido ya está en camino.",
            color: "green"
        },
        rejected: {
            icon: "❌",
            title: "Pago Rechazado",
            text: "Hubo un problema con tu tarjeta.",
            color: "red"
        },
        pending: {
            icon: "⏳",
            title: "Pago Pendiente",
            text: "Estamos esperando la confirmación.",
            color: "yellow"
        }
    };

    const current = config[status]; 
   

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className={`bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm border-t-8 border-${current.color}-500`}>
                <div className="text-5xl mb-4">{current.icon}</div>
                <h1 className="text-2xl font-bold mb-2">{current.title}</h1>
                <p className="text-gray-600 mb-6">{current.text}</p>
                
                {paymentId && (
                    <p className="text-xs text-gray-400 mb-4 font-mono">ID: {paymentId}</p>
                )}

                <Link to="/principal/dashboard" className={`block w-full py-3 rounded-xl font-bold text-white bg-${current.color}-500 hover:opacity-90 transition`}>
                    Volver a la Bodega
                </Link>
            </div>
        </div>
    );
};

export default EstadoPago;