export function parseSalary(persianString: string): number {
  // Map of Persian digits to English digits
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let cleanedString = persianString
    .replace(/حدود\s*|میلیون\s*|تومان\s*/g, "") // حذف حدود میلیون تومان
    .replace(/بودجه\s*/g, "") // حذف "بودجه" و فاصله های اضافی
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

export function persianToEnglishNumber(persianString: string): number {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let cleanedString = persianString
    .replace(" ", "")
    .replace(/تا/g, "")
    .replace(/از/g, "")
    .replace(/تومان/g, "")
    .replace(/[٬,]/g, "")
    .replace(/حدود\s*|میلیون\s*|تومان\s*/g, "");

  for (let i = 0; i < persianDigits.length; i++) {
    cleanedString = cleanedString.replace(
      new RegExp(persianDigits[i], "g"),
      englishDigits[i]
    );
  }

  const result = parseInt(cleanedString, 10);
  return isNaN(result) ? 0 : result;
}

export function parseSalaryRange(salaryText: string): {
  salaryStart: number;
  salaryEnd: number;
  salary: number;
} {
  const rangeMatch = salaryText.match(
    /(\d+(?:[٬,]\d+)*)\s*-\s*(\d+(?:[٬,]\d+)*)/
  );
  if (rangeMatch) {
    const start = persianToEnglishNumber(rangeMatch[1]);
    const end = persianToEnglishNumber(rangeMatch[2]);
    return { salaryStart: start, salaryEnd: end, salary: (start + end) / 2 };
  }
  const singleValue = persianToEnglishNumber(salaryText);
  return {
    salaryStart: singleValue,
    salaryEnd: singleValue,
    salary: singleValue,
  };
}

export function convertSalaryRangeToNumbers(salaryRangeText: string): number[] {
  // Remove spaces and "تومان"
  const cleanedText = salaryRangeText.replace(/\s*تومان\s*/g, "").trim();

  // Match the range numbers
  const rangeMatch = cleanedText.match(/(\d+)\s*-\s*(\d+)/);
  if (!rangeMatch) {
    return [];
  }

  const start = parseInt(rangeMatch[1], 10) * 1000000;
  const end = parseInt(rangeMatch[2], 10) * 1000000;

  return [start, end];
}
