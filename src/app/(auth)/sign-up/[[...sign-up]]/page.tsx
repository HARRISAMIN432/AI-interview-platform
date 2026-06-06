import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#050d14" }}>
      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden"
        style={{ padding: "48px 56px" }}
      >
        {/* Layered background */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "#050d14" }}
        />

        {/* Hexagonal grid overlay — matches sign-in */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.035 }}
        >
          <defs>
            <pattern
              id="hex-grid"
              x="0"
              y="0"
              width="56"
              height="97"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="28,0 56,14 56,42 28,56 0,42 0,14"
                fill="none"
                stroke="#00e5a0"
                strokeWidth="1"
              />
              <polygon
                points="28,56 56,70 56,97 28,111 0,97 0,70"
                fill="none"
                stroke="#00e5a0"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-grid)" />
        </svg>

        {/* Emerald glow — top-left */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,229,160,0.09) 0%, transparent 65%)",
            top: "-20%",
            left: "-25%",
          }}
        />
        {/* Secondary sapphire glow — bottom-right */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,180,255,0.05) 0%, transparent 70%)",
            bottom: "5%",
            right: "-5%",
          }}
        />

        {/* Thin vertical emerald accent line */}
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{
            width: 1,
            background:
              "linear-gradient(to bottom, transparent, #00e5a0 30%, #00e5a0 70%, transparent)",
            opacity: 0.18,
          }}
        />

        {/* ── LOGO ── */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(145deg, #00e5a0 0%, #00916a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 24px rgba(0,229,160,0.3)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#050d14"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div
              style={{
                color: "#e8faf4",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1,
              }}
            >
              Interview Pro
            </div>
            <div
              style={{
                color: "#00e5a0",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              Elite Tier
            </div>
          </div>
        </div>

        {/* ── HERO CONTENT — sign-up specific messaging ── */}
        <div className="relative z-10" style={{ maxWidth: 460 }}>
          {/* Headline */}
          <h1
            style={{
              fontSize: 58,
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: "-0.04em",
              color: "#e8faf4",
              margin: 0,
            }}
          >
            Start your
            <br />
            <span
              style={{
                color: "#00e5a0",
                textShadow: "0 0 40px rgba(0,229,160,0.25)",
              }}
            >
              Journey.
            </span>
            <br />
            Today.
          </h1>

          <p
            style={{
              color: "#4a6a7a",
              marginTop: 22,
              fontSize: 15.5,
              lineHeight: 1.65,
            }}
          >
            Create your free account and get instant access to AI-driven mock
            interviews, personalized feedback, and your roadmap to the offer.
          </p>

          {/* Feature checklist */}
          <div
            style={{
              marginTop: 36,
              borderTop: "1px solid rgba(255,255,255,0.05)",
              paddingTop: 32,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {[
              "Unlimited practice interviews",
              "Real-time behavioral scoring",
              "Company-specific coaching plans",
              "Expert answer frameworks",
            ].map((feature) => (
              <div
                key={feature}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "rgba(0,229,160,0.12)",
                    border: "1px solid rgba(0,229,160,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4l2.5 2.5L9 1"
                      stroke="#00e5a0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span
                  style={{
                    color: "#6a8a9a",
                    fontSize: 14,
                  }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Social proof avatars */}
          <div
            style={{
              marginTop: 36,
              background: "rgba(0,229,160,0.04)",
              border: "1px solid rgba(0,229,160,0.12)",
              borderRadius: 16,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 3,
                height: "100%",
                background: "linear-gradient(to bottom, #00e5a0, transparent)",
                borderRadius: "16px 0 0 16px",
              }}
            />
            {/* Avatar stack */}
            <div style={{ display: "flex", marginLeft: 4 }}>
              {["#00c98a", "#0099ff", "#7c5cf6", "#f59e0b"].map((color, i) => (
                <div
                  key={i}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: color,
                    border: "2px solid #0e1e2d",
                    marginLeft: i === 0 ? 0 : -8,
                    zIndex: 4 - i,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
            <div>
              <div
                style={{
                  color: "#c0dce8",
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                Joined by 12,000+ professionals
              </div>
              <div
                style={{
                  color: "#3d5a6e",
                  fontSize: 11.5,
                  marginTop: 3,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="relative z-10"
          style={{
            color: "#1e3040",
            fontSize: 11.5,
          }}
        >
          © 2026 Interview Pro AI · All rights reserved.
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="flex flex-col justify-center items-center w-full lg:w-[48%] relative"
        style={{ backgroundColor: "#0a1520", padding: "48px 32px" }}
      >
        {/* Top emerald gradient line */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #00e5a0 40%, #00b87a 70%, transparent)",
          }}
        />

        {/* Subtle background radial */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,229,160,0.04) 0%, transparent 65%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Mobile logo */}
        <div className="lg:hidden relative z-10 mb-10 text-center">
          <div
            style={{
              color: "#00e5a0",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            Interview Pro
          </div>
          <div
            style={{
              color: "#00e5a0",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: 0.6,
              marginTop: 2,
            }}
          >
            Elite Tier
          </div>
        </div>

        <div className="relative z-10 w-full" style={{ maxWidth: 380 }}>
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            appearance={{
              variables: {
                colorBackground: "#ffffff",
                colorText: "#0f172a",
                colorInputBackground: "#f8fafc",
                borderRadius: "0.75rem",
                fontSize: "15px",
              },
              elements: {
                rootBox: "w-full",
                cardBox:
                  "bg-[#0e1e2d] border border-[#152636] shadow-[0_0_60px_rgba(0,229,160,0.06)] rounded-2xl w-full overflow-hidden",
                card: "bg-transparent p-8 gap-6",

                headerTitle:
                  "text-[#dff0ea] text-2xl font-bold tracking-tight text-left leading-tight",
                headerSubtitle: "text-[#5a7f90] text-sm text-left mt-1",
                header: "items-start mb-1",

                socialButtonsBlockButton:
                  "bg-[#0a1520] border border-[#1a3048] text-[#dff0ea] hover:border-[#00c98a] hover:bg-[#0d1e2e] rounded-xl h-12 transition-all duration-200 font-medium",
                socialButtonsBlockButtonText:
                  "text-[#dff0ea] text-sm font-medium",

                dividerLine: "bg-[#152636]",
                dividerText: "text-[#3d5a6e] text-xs",

                formFieldLabel:
                  "text-[#5a7f90] text-[10px] font-bold uppercase tracking-widest mb-1.5",
                formFieldInput:
                  "bg-[#0a1520] border border-[#1a3048] text-[#dff0ea] h-12 rounded-xl focus:border-[#00c98a] focus:ring-2 focus:ring-[#00c98a]/15 transition-colors placeholder:text-[#2a4050] text-sm shadow-none",
                formFieldInputShowPasswordButton:
                  "text-[#3d5a6e] hover:text-[#00c98a]",

                otpCodeFieldInput:
                  "!bg-[#0a1520] !border !border-[#1a3048] !text-[#dff0ea] !rounded-xl focus:!border-[#00c98a] text-xl font-bold text-center !h-14 !w-12",
                otpCodeField: "gap-2",
                phoneInputBox:
                  "bg-[#0a1520] border border-[#1a3048] rounded-xl",

                formButtonPrimary:
                  "h-12 rounded-xl bg-[#00c98a] text-[#050d14] font-bold text-sm tracking-wide hover:bg-[#00b07a] active:scale-[0.98] transition-all duration-150 shadow-[0_4px_24px_rgba(0,201,138,0.3)] hover:shadow-[0_6px_32px_rgba(0,201,138,0.4)]",

                footerActionText: "text-[#3d5a6e] text-sm",
                footerActionLink:
                  "text-[#00c98a] hover:text-[#00e5a0] font-semibold transition-colors",
                footer: "bg-transparent mt-1",
                footerAction: "justify-center",

                form: "gap-4",
                main: "gap-5 w-full",

                alertText: "text-red-400 text-sm",
                alert: "bg-red-950/40 border border-red-800/40 rounded-xl p-3",

                identityPreviewText: "text-[#dff0ea]",
                identityPreviewEditButton:
                  "text-[#00c98a] hover:text-[#00e5a0]",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
