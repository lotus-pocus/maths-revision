import { useState } from "react";
import { C } from "../data";
import { SCENARIOS } from "./realWorldData";
import RealWorldRawScenario from "./scenarioTypes/RealWorldRawScenario";
import RealWorldBarChartScenario from "./scenarioTypes/RealWorldBarChartScenario";
import RealWorldCumFreqScenario from "./scenarioTypes/RealWorldCumFreqScenario";

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export default function RealWorld() {
  const [selectedId, setSelectedId] = useState(null);
  const scenario = SCENARIOS.find((s) => s.id === selectedId);

  if (!scenario) {
    return (
      <div>
        <p style={{ fontSize: "13px", color: C.muted, marginBottom: "16px", lineHeight: 1.6 }}>
          Choose a real-world situation. Each one shows how box plots help compare typical values and spread.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedId(s.id);
                scrollToTop();
              }}
              style={{
                padding: "16px",
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                gap: "14px",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "28px" }}>{s.icon}</span>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "800", color: C.text, margin: "0 0 4px" }}>
                  {s.title}
                </p>
                <p style={{ fontSize: "12px", color: C.muted, margin: 0 }}>
                  {s.hook}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const commonProps = {
    scenario,
    onRestart: () => {
      setSelectedId(null);
      scrollToTop();
    },
  };

  if (scenario.type === "raw") return <RealWorldRawScenario {...commonProps} />;
  if (scenario.type === "barchart") return <RealWorldBarChartScenario {...commonProps} />;
  if (scenario.type === "cumfreq") return <RealWorldCumFreqScenario {...commonProps} />;

  return null;
}