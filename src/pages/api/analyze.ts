import {
  GenerateContentCandidate,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import type { NextApiRequest, NextApiResponse } from "next";

interface BodyI {
  prompt: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const { prompt } = req.body as BodyI;

    if (!prompt) {
      return res.status(400).json({ ok: false, message: "Body mancante" });
    }

    try {
      if (process.env.NEXT_PUBLIC_GEMINI_KEY) {
        const genAI = new GoogleGenerativeAI(
          process.env.NEXT_PUBLIC_GEMINI_KEY
        );
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        console.log("Analysis Result:", result); // Log della risposta per debug

        const output = (
          result.response.candidates as GenerateContentCandidate[]
        )[0].content.parts[0].text;
        const analysis = parseAnalysis(output);

        if (analysis) {
          return res.status(200).json({ ok: true, message: analysis });
        } else {
          return res
            .status(500)
            .json({ ok: false, message: "Nessuna analisi generata" });
        }
      } else {
        return res
          .status(400)
          .json({
            ok: false,
            message: "Errore nella generazione (key missing)",
          });
      }
    } catch (e) {
      return res
        .status(500)
        .json({ ok: false, message: "Errore interno del server" });
    }
  } else {
    return res.status(405).json({ ok: false, message: "Metodo non gestito" });
  }
}

// Implementa questa funzione per gestire l'analisi del testo
function parseAnalysis(text: string): any {
  // Modifica questa logica in base al formato dell'analisi
  return text.split("\n").map((line, index) => ({
    question: `Domanda ${index + 1}`,
    answer: line,
  }));
}
