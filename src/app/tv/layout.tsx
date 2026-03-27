export default function TVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "var(--board-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 300ms ease",
      }}
    >
      {children}
    </div>
  );
}
