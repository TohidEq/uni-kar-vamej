"use client";

export const getFileNameOfWord = (
  word: string
): { isExist: boolean; fileName: string } => {
  const storedData = localStorage.getItem("keywords");
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      if (parsedData && parsedData.data) {
        const keywords: KeywordsData = parsedData.data;
        for (const keyword in keywords) {
          if (keywords.hasOwnProperty(keyword)) {
            if (
              keywords[keyword].relatives.includes(word.toLowerCase().trim())
            ) {
              return { isExist: true, fileName: keywords[keyword].file_name };
            }
          }
        }
      }
    } catch (error) {
      console.error("Error parsing keywords from localStorage:", error);
      // Return false in case of parsing error
      return { isExist: false, fileName: "" };
    }
  }

  return { isExist: false, fileName: "" };
};
