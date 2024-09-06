import Head from "next/head";
import style from "@/styles/Home.module.scss";
import Header from "@/components/Molecules/Header/Header";
import WindowBox from "@/components/Organism/WindowBox/WindowBox";
import RightSidebar from "@/components/Organism/WindowBox/RightSideBar";
import InputBox from "@/components/Atoms/InputBox/InputBox";
import SelectBox from "@/components/Molecules/SelectBox/SelectBox";
import { useState } from "react";
import { listaGeneri, fiabaRuoli } from "@/constants/common";
import Button from "@/components/Atoms/Button/Button";
import SwitchBox from "@/components/Molecules/SwitchBox/SwitchBox";
import Toast from "@/components/Atoms/Toast/Toast";
import VoiceController from "@/components/Organism/WindowBox/VoiceController";

interface Analisi {
  question: string;
  answer: string;
}

const Home = () => {
  const [protagonista, setProtagonista] = useState<string>("");
  const [protagonistaRuolo, setProtagonistaRuolo] = useState<string>("");
  const [antagonista, setAntagonista] = useState<string>("");
  const [antagonistaRuolo, setAntagonistaRuolo] = useState<string>("");
  const [genere, setGenere] = useState<string>("");
  const [pegi18, setPegi18] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [analisi, setAnalisi] = useState<Analisi[] | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(false);
    const prompt = `genera un racconto ${genere} per ${
      pegi18 ? "adulti" : "bambini"
    }, con il protagonista ${protagonistaRuolo} chiamato ${protagonista} e l'antagonista ${antagonistaRuolo} chiamato ${antagonista}.`;

    if (process.env.NEXT_PUBLIC_GEMINI_KEY) {
      if (
        protagonista.trim().length > 0 &&
        antagonista.trim().length > 0 &&
        protagonistaRuolo.trim().length > 0 &&
        antagonistaRuolo.trim().length > 0 &&
        genere.trim().length > 0
      ) {
        try {
          const response = await fetch("/api/generate", {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ prompt }),
          });
          const data = await response.json();
          if (!data.ok) {
            throw new Error("errore");
          }
          setResponse(data.message);
          setAnalisi(null); // Resetta l'analisi quando si genera un nuovo racconto
        } catch (e) {
          console.error("il nostro errore:", e);
          setError(true);
        }
        setLoading(false);
      }
    }
  };

  const handleAnalyze = async () => {
    if (response.trim().length > 0) {
      setLoading(true);
      setError(false);

      const analysisPrompt = `Analizza il seguente testo e fornisci cinque domande e risposte: ${response}`;

      try {
        const analysisResponse = await fetch("/api/analyze", {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ prompt: analysisPrompt }),
        });
        const analysisData = await analysisResponse.json();
        if (!analysisData.ok) {
          throw new Error("errore analisi");
        }
        setAnalisi(analysisData.message);
      } catch (e) {
        console.error("Errore nell'analisi:", e);
        setError(true);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Ai Story Teller</title>
        <meta name="description" content="AI based app to generate stories" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={style.main}>
        <Header title="AI Story Teller" />
        <div className={style.content}>
          {error && (
            <Toast
              setAction={setError}
              title="Errore"
              message="Errore nella creazione del racconto"
            />
          )}
          <WindowBox title="Story Params">
            <div className={style.container}>
              <InputBox
                label="Nome Protagonista:"
                value={protagonista}
                setValue={setProtagonista}
              />
              <SelectBox
                label="Ruolo Protagonista:"
                list={fiabaRuoli}
                setAction={setProtagonistaRuolo}
              />
              <InputBox
                label="Nome Antagonista:"
                value={antagonista}
                setValue={setAntagonista}
              />
              <SelectBox
                label="Ruolo Antagonista:"
                list={fiabaRuoli}
                setAction={setAntagonistaRuolo}
              />
              <SelectBox
                label="Genere:"
                list={listaGeneri}
                setAction={setGenere}
              />
              <SwitchBox
                label="Per Adulti:"
                value={pegi18}
                setValue={setPegi18}
              />
              <Button
                label="Genera"
                onClick={handleGenerate}
                disabled={
                  protagonista.trim().length <= 0 ||
                  antagonista.trim().length <= 0 ||
                  genere.trim().length <= 0 ||
                  loading
                }
              />
              {response && (
                <Button
                  label="Analizza"
                  onClick={handleAnalyze}
                  disabled={loading}
                />
              )}
            </div>
          </WindowBox>

          <RightSidebar title="Voice Options">
            <VoiceController text={response} />
          </RightSidebar>

          {loading && (
            <div className={style.loading}>
              <p>loading...</p>
            </div>
          )}
          {!loading && response && (
            <div className={style.result}>
              <h2 className={style.title}>Racconto Generato</h2>
              <p>{response}</p>
            </div>
          )}
          {analisi && (
            <div className={style.analysis}>
              <h2 className={style.title}>Analisi del Racconto</h2>
              <ul>
                {analisi.map((item, index) => (
                  <li key={index} className={style.question}>
                    <strong>{item.question}</strong> {item.answer}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
