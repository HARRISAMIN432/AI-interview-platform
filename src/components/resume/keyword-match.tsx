interface KeywordMatchProps {
  matchedKeywords: string[];
  missingKeywords: string[];
}

export function KeywordMatch({
  matchedKeywords,
  missingKeywords,
}: KeywordMatchProps) {
  return (
    <div className="space-y-4">
      {/* Matched */}
      {matchedKeywords.length > 0 && (
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2.5"
            style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
          >
            Matched ({matchedKeywords.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {matchedKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium"
                style={{
                  background: "rgba(0,229,160,0.07)",
                  border: "1px solid rgba(0,229,160,0.18)",
                  color: "#00e5a0",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#00e5a0",
                    display: "inline-block",
                    boxShadow: "0 0 4px rgba(0,229,160,0.6)",
                    flexShrink: 0,
                  }}
                />
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing */}
      {missingKeywords.length > 0 && (
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2.5"
            style={{ color: "#4a6a7a", fontFamily: "var(--font-syne)" }}
          >
            Missing ({missingKeywords.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium"
                style={{
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.18)",
                  color: "#f87171",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#f87171",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {matchedKeywords.length === 0 && missingKeywords.length === 0 && (
        <p
          className="text-xs"
          style={{ color: "#3d6070", fontFamily: "var(--font-dm-sans)" }}
        >
          No keyword data available.
        </p>
      )}
    </div>
  );
}
