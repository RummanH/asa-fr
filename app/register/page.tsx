import Link from "next/link";
import { AuthPageShell } from "@/components/forms/auth-page-shell";

export default function RegisterPage() {
  return (
    <AuthPageShell>
      <div className="w-full max-w-[480px]">
        <div
          style={{
            background: "white",
            borderRadius: 24,
            border: "1px solid rgba(212,230,239,0.8)",
            boxShadow: "0 20px 60px rgba(5,47,68,0.1), 0 1px 0 rgba(255,255,255,0.9) inset",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #052f44 0%, #065770 55%, #076b82 100%)",
              padding: "22px 28px 20px",
            }}
          >
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "white", letterSpacing: "-0.03em", margin: 0 }}>
              Choose Registration Type
            </h1>
            <p style={{ fontSize: 12, color: "rgba(169,211,239,0.78)", margin: "4px 0 0" }}>
              Select how you want to join the platform.
            </p>
          </div>

          <div style={{ padding: "26px 28px 30px" }}>
            <div className="grid gap-3">
              <Link className="app-btn-primary h-11 justify-center" href="/register/teacher">
                Register as Teacher
              </Link>
              <Link className="app-btn-secondary h-11 justify-center" href="/register/institution">
                Register as Institution
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthPageShell>
  );
}
