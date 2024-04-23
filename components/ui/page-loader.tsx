export default function PageLoader() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <div className="flex flex-row justify-center items-center">
        <div className="w-3 h-3 bg-ternary rounded-full animate-bounce mr-1"></div>
        <div className="w-3 h-3 bg-ternary rounded-full animate-bounce mr-1"></div>
        <div className="w-3 h-3 bg-ternary rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
