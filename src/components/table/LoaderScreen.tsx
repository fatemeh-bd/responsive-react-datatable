const LoaderScreen = ({ className }: { className?: string }) => {
  return (
    <div
      className={className ? className : ""}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(42, 42, 42, 0.08)",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <img
        className="md:translate-x-[-80px]"
        width="200"
        height="200"
        src="/loading.gif"
        alt="درحال بارگذاری..."
      />
    </div>
  );
};

export default LoaderScreen;
