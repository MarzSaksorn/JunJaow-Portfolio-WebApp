export interface ColorPreset {
  id: string;
  name: string;
  nameEn: string;
  desc: string;
  accent: string;
}

export const presets: ColorPreset[] = [
  { id: "lavender", name: "ลาเวนเดอร์", nameEn: "Lavender", desc: "ม่วงอ่อนกับชมพูพาสเทล", accent: "#f87195" },
  { id: "warm", name: "วอร์ม", nameEn: "Warm", desc: "น้ำตาลอบอุ่นกับทอง", accent: "#c4842d" },
  { id: "mint", name: "มิ้นต์", nameEn: "Mint", desc: "เขียวมิ้นต์สบายตา", accent: "#2d9d7a" },
  { id: "slate", name: "สเลท", nameEn: "Slate", desc: "น้ำเงินเทาดูมืออาชีพ", accent: "#3b82f6" },
];

export function applyPreset(id: string) {
  if (typeof window === "undefined") return;
  document.documentElement.setAttribute("data-color-preset", id);
  localStorage.setItem("color-preset", id);
}

export function getSavedPreset(): string {
  if (typeof window === "undefined") return "lavender";
  return localStorage.getItem("color-preset") || "lavender";
}
