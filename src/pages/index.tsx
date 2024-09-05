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

export default function Home() {
  const [protagonista, setProtagonista] = useState("");
  const [protagonistaRuolo, setProtagonistaRuolo] = useState("");
  const [antagonista, setAntagonista] = useState("");
  const [antagonistaRuolo, setAntagonistaRuolo] = useState("");
  const [genere, setGenere] = useState("");
  const [pegi18, setPegi18] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(false);

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
        } catch (e) {
          console.error("il nostro errore:", e);
          setError(true);
        }
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
            <div className={style.result}>{response}</div>
          )}
        </div>
      </main>
    </>
  );
}
