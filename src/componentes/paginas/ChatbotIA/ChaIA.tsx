import React, { useState, useRef, useEffect } from 'react';
import { useApiObtenerChatIAMutation } from '../../../api/apiSlice';
import { FaRobot, FaUser, FaPaperPlane, FaSpinner } from 'react-icons/fa';

interface Message {
    role: 'user' | 'ai';
    content: string;
    data?: any[];
}

const ChatIAPage = () => {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: 'Hola, soy tu asistente virtual de la Bodega. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [askAI, { isLoading }] = useApiObtenerChatIAMutation();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!question.trim()) return;

        const currentQuestion = question;
        setQuestion('');

        // Agregar mensaje del usuario
        setMessages(prev => [...prev, { role: 'user', content: currentQuestion }]);

        try {
            const response = await askAI({ question: currentQuestion }).unwrap();

            // Agregar respuesta de la IA
            setMessages(prev => [...prev, {
                role: 'ai',
                content: response.answer,
                data: response.data
            }]);

        } catch (error) {
            console.error("Error al consultar IA:", error);
            setMessages(prev => [...prev, { role: 'ai', content: 'Lo siento, ocurrió un error al procesar tu solicitud.' }]);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-gray-50 rounded-lg shadow-lg overflow-hidden border border-gray-200">
            {/* Header del Chat */}
            <div className="bg-primary text-white p-4 flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                    <FaRobot size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Asistente Bodega IA</h2>
                    <p className="text-xs text-white/80">Pregunta sobre ventas, productos o stock</p>
                </div>
            </div>

            {/* Area de Mensajes */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-green-600'} text-white`}>
                                {msg.role === 'user' ? <FaUser size={14} /> : <FaRobot size={14} />}
                            </div>

                            {/* Burbuja de Texto */}
                            <div className={`p-3 rounded-2xl shadow-sm text-sm ${msg.role === 'user'
                                ? 'bg-blue-100 text-blue-900 rounded-tr-none'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                }`}>
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                                {/* Renderizado de Datos Extra (Tablas simples) si existen */}
                                {msg.data && msg.data.length > 0 && (
                                    <div className="mt-3 overflow-x-auto bg-gray-50 rounded p-2 border border-gray-200">
                                        <table className="w-full text-xs text-left">
                                            <thead className="text-gray-500 font-semibold border-b">
                                                <tr>
                                                    {Object.keys(msg.data[0]).map((key) => (
                                                        <th key={key} className="p-1 capitalize">{key}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {msg.data.map((row: any, i: number) => (
                                                    <tr key={i} className="border-b last:border-0 hover:bg-gray-100">
                                                        {Object.values(row).map((val: any, j: number) => (
                                                            <td key={j} className="p-1 truncate max-w-[150px]">
                                                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                                <FaRobot size={14} />
                            </div>
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2 text-gray-400 text-sm">
                                <FaSpinner className="animate-spin" /> Pensando...
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Escribe tu pregunta aquí... (ej. ¿Cuál es el producto más vendido?)"
                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!question.trim() || isLoading}
                        className="bg-primary text-white p-3 rounded-full hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center justify-center transform active:scale-95"
                    >
                        {isLoading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatIAPage;