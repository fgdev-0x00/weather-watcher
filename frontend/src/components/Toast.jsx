import { CheckCircle, XCircle, Info } from 'lucide-react';

const styles = {
  success: {
    bg: 'bg-green-600',
    icon: <CheckCircle className="w-5 h-5" />,
  },
  error: {
    bg: 'bg-red-600',
    icon: <XCircle className="w-5 h-5" />,
  },
  info: {
    bg: 'bg-blue-600',
    icon: <Info className="w-5 h-5" />,
  },
};

export default function Toast({ type, message }) {
  const style = styles[type];

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 text-white rounded-xl shadow-lg ${style.bg}`}
      >
        {style.icon}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
