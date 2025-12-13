export default function AppContainer({ children }) {
  return (
    <div
      className="
        max-w-[420px] min-h-screen mx-auto bg-white
        shadow-[0_0_20px_rgba(0,0,0,0.05)]
        relative overflow-hidden
        md:max-w-[900px] md:min-h-[80vh]
        md:my-[10vh] md:rounded-[1.5rem]
        md:shadow-[0_15px_40px_rgba(0,0,0,0.15)]
      "
    >
      {children}
    </div>
  );
}
