export const improveWithAI = async (text, type) => {
  try {
    const res = await fetch("http://localhost:4000/api/ai/improve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text, // ✅ REQUIRED
        type: type, // ✅ REQUIRED
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch AI response");
    }

    const data = await res.json();

    let result = data.improvedText || "";

    // 🔥 CLEAN OUTPUT (VERY IMPORTANT)
    result = result
      .replace(/[*•-]/g, "") // remove bullets
      .replace(/\n+/g, "\n") // remove extra new lines
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, type === "skills" ? 10 : 4) // limit lines
      .join(type === "skills" ? ", " : "\n");

    return result;
  } catch (error) {
    console.error("AI ERROR:", error);
    return text; // fallback if API fails
  }
};
