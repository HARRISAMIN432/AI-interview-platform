import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "#0d1b2a" }}
    >
      {/* Background subtle gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(0,229,160,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,229,160,0.03) 0%, transparent 40%)",
        }}
      />

      {/* Branding */}
      <div className="absolute top-8 left-8 flex flex-col">
        <span
          className="text-2xl font-bold"
          style={{ color: "#00e5a0", fontFamily: "'Syne', sans-serif" }}
        >
          Interview Pro
        </span>
        <span className="text-xs" style={{ color: "#6b7f8e" }}>
          Elite Tier
        </span>
      </div>

      <SignUp
        routing="path"
        path="/sign-up"
        appearance={{
          variables: {
            colorPrimary: "#00e5a0",
            colorBackground: "#112233",
            colorText: "#e0eaf4",
            colorTextSecondary: "#8a9bb0",
            colorInputBackground: "#0d1b2a",
            colorInputText: "#e0eaf4",
            borderRadius: "0.75rem",
            fontFamily: "'DM Sans', sans-serif",
          },
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "shadow-2xl border",
            cardBox:
              "bg-[#112233] border border-[#1e3448] shadow-[0_0_60px_rgba(0,229,160,0.07)] rounded-xl",
            headerTitle: "text-[#e0eaf4] text-2xl font-bold tracking-tight",
            headerSubtitle: "text-[#8a9bb0]",

            // Social buttons
            socialButtonsBlockButton:
              "bg-[#0d1b2a] border border-[#1e3448] text-[#e0eaf4] hover:bg-[#1a2e42] hover:border-[#00e5a0] transition-all duration-200",
            socialButtonsBlockButtonText: "text-[#e0eaf4]",

            // Divider
            dividerLine: "bg-[#1e3448]",
            dividerText: "text-[#8a9bb0]",

            // Form fields
            formFieldLabel: "text-[#8a9bb0] text-sm font-medium",
            formFieldInput:
              "bg-[#0d1b2a] border border-[#1e3448] text-[#e0eaf4] focus:border-[#00e5a0] focus:ring-1 focus:ring-[#00e5a0] rounded-lg transition-all duration-200 placeholder:text-[#3d5166]",
            formFieldInputShowPasswordButton:
              "text-[#8a9bb0] hover:text-[#00e5a0]",

            // OTP / Phone input
            otpCodeFieldInput:
              "bg-[#0d1b2a] border border-[#1e3448] text-[#e0eaf4] focus:border-[#00e5a0] focus:ring-[#00e5a0] rounded-lg text-center text-lg font-bold",
            phoneInputBox: "bg-[#0d1b2a] border border-[#1e3448] rounded-lg",

            // Primary button
            formButtonPrimary:
              "bg-[#00e5a0] text-[#0d1b2a] font-semibold hover:bg-[#00c98a] active:bg-[#00b07a] transition-all duration-200 shadow-[0_0_20px_rgba(0,229,160,0.3)] hover:shadow-[0_0_30px_rgba(0,229,160,0.5)] rounded-lg",

            // Footer
            footerActionText: "text-[#8a9bb0]",
            footerActionLink:
              "text-[#00e5a0] hover:text-[#00c98a] font-medium transition-colors",
            footer: "bg-transparent",

            // Internal
            main: "gap-4",
            form: "gap-4",

            // Alert / Error
            alertText: "text-red-400",
            alert: "bg-red-900/20 border border-red-800/50 rounded-lg",

            // Identifiers
            identityPreviewText: "text-[#e0eaf4]",
            identityPreviewEditButtonIcon: "text-[#00e5a0]",
          },
        }}
      />

      {/* Bottom tagline */}
      <div
        className="absolute bottom-8 text-xs text-center w-full"
        style={{ color: "#3d5166" }}
      >
        © 2024 Interview Pro AI. All rights reserved.
      </div>
    </div>
  );
}
