export function parseSalary(persianString: string): number {
  // Map of Persian digits to English digits
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let cleanedString = persianString
    .replace(/بودجه\s*/g, "") // Remove "بودجه" and optional whitespace
    .replace(/تومان/g, "") // حذف "تومان"
    .replace(/,/g, ""); // حذف جداکننده هزارگان فارسی

  for (let i = 0; i < persianDigits.length; i++) {
    cleanedString = cleanedString.replace(
      new RegExp(persianDigits[i], "g"),
      englishDigits[i]
    );
  }

  return parseInt(cleanedString, 10);
}
