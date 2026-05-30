import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: "#080f17",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12"
        style={{ backgroundColor: "#080f17" }}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,229,160,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,229,160,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow orbs */}
        <div
          className="absolute"
          style={{
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,229,160,0.12) 0%, transparent 70%)",
            top: "10%",
            left: "-10%",
          }}
        />
        <div
          className="absolute"
          style={{
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,180,255,0.07) 0%, transparent 70%)",
            bottom: "15%",
            right: "5%",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #00e5a0, #00b87a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#080f17"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div
              style={{
                color: "#00e5a0",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              Interview Pro
            </div>
            <div
              style={{
                color: "#3d5a6e",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Elite Tier
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 space-y-8">
          <div>
            <div
              style={{
                display: "inline-block",
                background: "rgba(0,229,160,0.1)",
                border: "1px solid rgba(0,229,160,0.2)",
                borderRadius: 20,
                padding: "4px 14px",
                color: "#00e5a0",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              AI-Powered Interview Coaching
            </div>
            <h1
              style={{
                fontSize: 52,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#e8f4f0",
              }}
            >
              Land your
              <br />
              <span style={{ color: "#00e5a0" }}>dream role.</span>
              <br />
              Every time.
            </h1>
            <p
              style={{
                color: "#4e7080",
                marginTop: 20,
                fontSize: 16,
                lineHeight: 1.6,
                maxWidth: 400,
              }}
            >
              Real-time AI feedback, behavioral scoring, and personalized
              coaching that adapts to your target company.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            {[
              { val: "94%", label: "Offer rate" },
              { val: "12k+", label: "Interviews aced" },
              { val: "4.9★", label: "User rating" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#e8f4f0",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.val}
                </div>
                <div style={{ fontSize: 12, color: "#4e7080", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
              padding: "20px 24px",
              maxWidth: 420,
            }}
          >
            <div
              style={{
                color: "#00e5a0",
                fontSize: 24,
                marginBottom: 10,
                lineHeight: 1,
              }}
            >
              "
            </div>
            <p style={{ color: "#8aaabb", fontSize: 14, lineHeight: 1.6 }}>
              Interview Pro got me the Google L5 offer after 3 failed attempts.
              The AI feedback is brutally honest and exactly what I needed.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #00e5a0, #0099ff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#080f17",
                }}
              >
                A
              </div>
              <div>
                <div
                  style={{ color: "#c8dde8", fontSize: 13, fontWeight: 600 }}
                >
                  Ahmad R.
                </div>
                <div style={{ color: "#3d5a6e", fontSize: 11 }}>
                  Software Engineer @ Google
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative z-10"
          style={{ color: "#2a3d4a", fontSize: 12 }}
        >
          © 2024 Interview Pro AI. All rights reserved.
        </div>
      </div>

      {/* ── RIGHT PANEL — white ── */}
      <div
        className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 py-12 relative"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Top green accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: "linear-gradient(90deg, #00e5a0, #00b87a)" }}
        />

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <div style={{ color: "#00b87a", fontSize: 22, fontWeight: 700 }}>
            Interview Pro
          </div>
          <div style={{ color: "#9db8c4", fontSize: 11, textAlign: "center" }}>
            Elite Tier
          </div>
        </div>

        <div className="w-full max-w-sm">
          <SignIn
            routing="path"
            path="/sign-in"
            appearance={{
              variables: {
                colorPrimary: "#00c98a",
                colorBackground: "#ffffff",
                colorText: "#0d1f2d",
                colorTextSecondary: "#6b8899",
                colorInputBackground: "#f5f8fa",
                colorInputText: "#0d1f2d",
                borderRadius: "0.625rem",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
              },
              layout: {
                showOptionalFields: true,
              },
              elements: {
                rootBox: "w-full",
                cardBox: "bg-transparent shadow-none border-0 w-full p-0",
                card: "bg-transparent shadow-none p-0 gap-6",

                headerTitle:
                  "text-[#0d1f2d] text-3xl font-bold tracking-tight text-left",
                headerSubtitle: "text-[#6b8899] text-sm text-left",
                header: "items-start mb-2",

                socialButtonsBlockButton:
                  "bg-white border border-[#e2eaee] text-[#0d1f2d] hover:border-[#00c98a] hover:bg-[#f0fdf8] rounded-xl h-12 transition-all duration-200 font-medium shadow-sm",
                socialButtonsBlockButtonText:
                  "text-[#0d1f2d] text-sm font-medium",

                dividerLine: "bg-[#e2eaee]",
                dividerText: "text-[#aabbc6] text-xs",

                formFieldLabel:
                  "text-[#6b8899] text-xs font-semibold uppercase tracking-wider mb-1",
                formFieldInput:
                  "bg-[#f5f8fa] border border-[#e2eaee] text-[#0d1f2d] h-12 rounded-xl focus:border-[#00c98a] focus:ring-1 focus:ring-[#00c98a]/30 focus:ring-offset-0 transition-colors placeholder:text-[#bccdd6] text-sm shadow-none",
                formFieldInputShowPasswordButton:
                  "text-[#aabbc6] hover:text-[#00c98a]",

                otpCodeFieldInput:
                  "!bg-[#f5f8fa] !border !border-[#e2eaee] !text-[#0d1f2d] !rounded-xl focus:!border-[#00c98a] text-xl font-bold text-center !h-14 !w-12",
                otpCodeField: "gap-2",

                formButtonPrimary:
                  "h-12 rounded-xl bg-[#00c98a] text-white font-bold text-sm tracking-wide hover:bg-[#00b07a] active:bg-[#009a6a] transition-all duration-200 shadow-[0_4px_14px_rgba(0,201,138,0.35)] hover:shadow-[0_6px_20px_rgba(0,201,138,0.45)]",

                footerActionText: "text-[#8aaabb] text-sm",
                footerActionLink:
                  "text-[#00c98a] hover:text-[#00b07a] font-semibold transition-colors",
                footer: "bg-transparent mt-2",
                footerAction: "justify-center",

                form: "gap-4",
                main: "gap-5 w-full",

                alertText: "text-red-600 text-sm",
                alert: "bg-red-50 border border-red-200 rounded-xl p-3",

                identityPreviewText: "text-[#0d1f2d]",
                identityPreviewEditButton:
                  "text-[#00c98a] hover:text-[#00b07a]",

                phoneInputBox:
                  "bg-[#f5f8fa] border border-[#e2eaee] rounded-xl",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
