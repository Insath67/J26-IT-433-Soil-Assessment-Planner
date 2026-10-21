import { Sprout } from "lucide-react";

function LoadingSpinner({ text = "Loading soil telemetry..." }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
      gap: "14px"
    }}>
      <div style={{
        position: "relative",
        width: "50px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: "3px solid var(--green-light-100)",
          borderTopColor: "var(--green-dark-800)",
          animation: "spin 1s linear infinite"
        }}></div>
        <Sprout size={20} style={{ color: "var(--green-light-500)" }} />
      </div>
      <p style={{
        fontSize: "13px",
        fontWeight: "600",
        color: "var(--text-muted)",
        letterSpacing: "0.02em"
      }}>
        {text}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner;