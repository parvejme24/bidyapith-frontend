export const toastTone = {
  rose: {
    background: "rgba(255,126,157,.16)",
    border: "1px solid rgba(255,126,157,.45)",
    color: "#FFC9D6",
  },
  gold: {
    background: "rgba(255,180,84,.16)",
    border: "1px solid rgba(255,180,84,.45)",
    color: "#FFE0B8",
  },
  jade: {
    background: "rgba(46,211,167,.16)",
    border: "1px solid rgba(46,211,167,.45)",
    color: "#B6F5E3",
  },
} as const;

export const BD_PHONE = /^(\+?88)?01[3-9]\d{8}$/;

export function normalizePhone(value: string) {
  return value.replace(/[\s-]/g, "");
}

export function passwordScore(value: string) {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score as 0 | 1 | 2 | 3 | 4;
}

export const PASSWORD_LABELS = ["Too short", "Weak", "Getting there", "Good", "Strong"] as const;
export const PASSWORD_TONES = ["hot", "hot", "warn", "", ""] as const;
