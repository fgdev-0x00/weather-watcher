export default function Button({
  children,
  type = 'button',
  onClick,
  className = '',
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-4 mt-10
        bg-indigo-600 text-white
        font-bold rounded-xl
        shadow-lg
        hover:bg-indigo-700
        hover:cursor-pointer
        active:bg-indigo-800
        transition
        focus:outline-none
        focus:ring-4
        focus:ring-indigo-500/50
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}
