import { useState, useRef, useEffect, useCallback } from "react";
import { Send, SkipForward, Loader2 } from "lucide-react";

const MAX_CHARS = 5000;
const WARN_THRESHOLD = 4500;

interface AnswerInputProps {
  questionId: string;
  isSubmitting: boolean;
  onSubmit: (questionId: string, answerText: string) => void;
  onSkip: (questionId: string) => void;
}

export function AnswerInput({
  questionId,
  isSubmitting,
  onSubmit,
  onSkip,
}: AnswerInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus on mount and when questionId changes
  useEffect(() => {
    setValue("");
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [questionId]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 280)}px`;
  }, [value]);

  const handleSubmit = useCallback(() => {
    if (!value.trim() || isSubmitting) return;
    onSubmit(questionId, value.trim());
  }, [value, isSubmitting, onSubmit, questionId]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  const charCount = value.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isNearLimit = charCount >= WARN_THRESHOLD;
  const canSubmit = value.trim().length > 0 && !isSubmitting && !isOverLimit;

  const charColor = isOverLimit
    ? "#f87171"
    : isNearLimit
      ? "#f59e0b"
      : "#3d6070";

  return (
    <div className="space-y-3">
      {/* Textarea */}
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-200"
        style={{
          border: `1px solid ${value.length > 0 ? "#1a3048" : "#152636"}`,
          background: "#0c1a27",
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          placeholder="Type your answer here…"
          className="w-full resize-none bg-transparent px-5 py-4 text-sm outline-none disabled:opacity-50"
          style={{
            color: "#dff0ea",
            fontFamily: "var(--font-dm-sans)",
            lineHeight: 1.7,
            minHeight: 140,
            caretColor: "#00e5a0",
          }}
          rows={5}
        />

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between px-5 py-2.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span
            className="text-xs"
            style={{ color: charColor, fontFamily: "var(--font-dm-sans)" }}
          >
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
          <span
            className="text-xs"
            style={{ color: "#2a4050", fontFamily: "var(--font-dm-sans)" }}
          >
            Ctrl+Enter to submit
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {/* Skip */}
        <button
          type="button"
          onClick={() => onSkip(questionId)}
          disabled={isSubmitting}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-medium transition-all hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-40"
          style={{
            border: "1px solid #1a3048",
            color: "#4a6a7a",
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          <SkipForward size={12} strokeWidth={2} />
          Skip
        </button>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: canSubmit ? "#00c98a" : "#0e1e2d",
            color: canSubmit ? "#050d14" : "#3d6070",
            border: canSubmit ? "none" : "1px solid #1a3048",
            fontFamily: "var(--font-syne)",
            boxShadow: canSubmit ? "0 4px 16px rgba(0,201,138,0.25)" : "none",
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Send size={13} strokeWidth={2.5} />
              Submit Answer
            </>
          )}
        </button>
      </div>
    </div>
  );
}
