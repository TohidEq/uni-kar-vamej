"use client";

export const getFileNameOfWord = (
  keyword: string
): { isExist: boolean; fileName: string } => {
  const word = decodeURIComponent(keyword).replaceAll("+", " ");

  console.log(`Check \t"${word}"\t Word in LocalStorage.keywords...`);
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
              console.log(
                `========\nThis \t"${word}"\t Word has been founded in LocalStorage.keywords\n \t Filename: ${keywords[keyword].file_name}\n========`
              );
              return { isExist: true, fileName: keywords[keyword].file_name };
            }
          }
        }
      }
    } catch (error) {
      console.log(`========\n!! This \t"${word}"\t Word not found\n========`);
      console.error("Error parsing keywords from localStorage:", error);
      // Return false in case of parsing error
      return { isExist: false, fileName: "" };
    }
  }

  console.log(`========\n!! This \t"${word}"\t Word not found\n========`);
  return { isExist: false, fileName: "" };
};
