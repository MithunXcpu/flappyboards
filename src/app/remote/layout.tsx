export default function RemoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--fg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 300ms ease",
        padding: "40px 0",
      }}
    >
      {children}
    </div>
  );
}
