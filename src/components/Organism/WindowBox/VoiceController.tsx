import { useState, useEffect } from "react";
import Button from "@/components/Atoms/Button/Button";

interface VoiceControllerProps {
  text: string;
}

const VoiceController = ({ text }: VoiceControllerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Funzione per gestire la riproduzione vocale
  const handleVoice = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = pitch;
    utterance.rate = rate;
    if (voice) {
      utterance.voice = voice;
    }
    setIsPlaying(true);
    speechSynthesis.speak(utterance);

    utterance.onend = () => {
      setIsPlaying(false);
    };
  };

  // Funzione per interrompere la voce
  const handleStopVoice = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  // Effetto per ottenere le voci disponibili
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      // Filtra solo le voci che si chiamano "Cosimo" ed "Elsa"
      const filteredVoices = availableVoices.filter(
        (v) => v.name.includes("Cosimo") || v.name.includes("Elsa")
      );
      setVoices(filteredVoices);
      // Imposta la prima voce disponibile (ad esempio Cosimo o Elsa) come default
      if (filteredVoices.length > 0) {
        setVoice(filteredVoices[0]);
      }
    };

    loadVoices();
    // Alcuni browser potrebbero non caricare le voci immediatamente
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  return (
    <div>
      <h3>Voice Controller</h3>
      <label>
        Timbro (Pitch):
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={pitch}
          onChange={(e) => setPitch(parseFloat(e.target.value))}
        />
      </label>
      <label>
        Velocità (Rate):
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
        />
      </label>
      <label>
        Voce:
        <select
          value={voice?.name || ""}
          onChange={(e) => {
            const selectedVoice = voices.find((v) => v.name === e.target.value);
            setVoice(selectedVoice || null);
          }}
        >
          {voices.map((v) => (
            <option key={v.name} value={v.name}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>
      </label>
      <div>
        {isPlaying ? (
          <Button label="Stop" onClick={handleStopVoice} />
        ) : (
          <Button label="Play" onClick={handleVoice} />
        )}
      </div>
    </div>
  );
};

export default VoiceController;
