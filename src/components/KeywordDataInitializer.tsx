"use client";

import { useEffect } from "react";

const KeywordDataInitializer = () => {
  useEffect(() => {
    const fetchData = async () => {
      const storedData = localStorage.getItem("keywords");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          const { expireTime } = parsedData;
          if (expireTime && new Date(expireTime) > new Date()) {
            // Data is valid, do nothing
            return null; // EXIT
          }
        } catch (error) {
          console.error("Error parsing keywords from localStorage:", error);
          // If there's an error parsing, treat it as if the data doesn't exist
        }
      }

      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/TohidEq/uni-kar-vamej-data/main/relative_words.json"
        );
        const newData = await response.json();

        console.log("Data fetched successfully:", newData); // Add this line
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(3, 0, 0, 0); // Set to 3 AM
        const expireTime = tomorrow.toISOString();

        const dataToStore = {
          expireTime,
          data: newData,
        };
        localStorage.setItem("keywords", JSON.stringify(dataToStore));
      } catch (error) {
        console.error("Error fetching or storing keywords:", error);
      }
    };
    fetchData();
  }, []);

  return null; // EXIT
};

export default KeywordDataInitializer;
