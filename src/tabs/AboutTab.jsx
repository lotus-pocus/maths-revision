export default function AboutTab() {
  return (
    <div style={{ paddingBottom: "2rem" }}>

      <div style={{ background: "#ecfdf5", border: "1px solid #059669",
        borderRadius: "12px", padding: "16px 18px", marginBottom: "14px" }}>
        <p style={{ fontSize: "15px", fontWeight: "800", color: "#065f46", margin: "0 0 10px" }}>
          Why does this exist? 📖
        </p>
        <p style={{ fontSize: "13px", color: "#065f46", margin: "0 0 10px", lineHeight: 1.8 }}>
          My daughter came home from school with a practice paper she'd printed out in the library. She was stuck on a box plot question. She asked her teacher, who scribbled something barely legible on the paper and moved on.
        </p>
        <p style={{ fontSize: "13px", color: "#065f46", margin: "0 0 10px", lineHeight: 1.8 }}>
          That was the moment I decided to build something better. Not just an answer, but something that actually explains <em>why</em>, shows real-world context, and lets you practise until it clicks.
        </p>
        <p style={{ fontSize: "13px", color: "#065f46", margin: 0, lineHeight: 1.8 }}>
          It started with box plots. I'm building it out topic by topic to cover the full Edexcel GCSE Maths specification. It's a work in progress, but hopefully already more useful than a scribble on a page. 😅
        </p>
      </div>

      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb",
        borderRadius: "12px", padding: "14px 16px", marginBottom: "14px" }}>
        <p style={{ fontSize: "13px", color: "#374151", margin: 0, lineHeight: 1.8 }}>
          If you've found your way here and it's useful for your own revision, that's brilliant, please help yourself. Good luck in your exams. 🌟
        </p>
      </div>

      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb",
        borderRadius: "12px", padding: "14px 16px", marginBottom: "14px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 8px" }}>📱 How to use this app</p>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.8 }}>
          Pick a topic from the Topics tab and open the interactive lesson. Work through <strong>Learn</strong> first to understand the concept, then test yourself in <strong>Exam</strong>. Use the <strong>Glossary</strong> to look up terms. Your progress is saved on this device, tap your initial in the corner to switch between users if you're sharing with someone else.
        </p>
      </div>

      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb",
        borderRadius: "12px", padding: "14px 16px", marginBottom: "14px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 8px" }}>📋 Exam board</p>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.8 }}>
          All content is aligned to the <strong>Edexcel GCSE Mathematics specification (1MA1)</strong>, covering both Foundation and Higher tier. Questions are written in Edexcel style, the same structure and wording you'll see in the real exam.
        </p>
      </div>

      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb",
        borderRadius: "12px", padding: "14px 16px", marginBottom: "14px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 8px" }}>👨‍💻 Who made this?</p>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 10px", lineHeight: 1.8 }}>
          I work at <a href="https://www.gamoola.com" target="_blank" rel="noopener noreferrer"
            style={{ color: "#059669", fontWeight: "600" }}>Gamoola</a> — a small creative studio
          building interactive digital experiences. This maths app is a personal project, not a commercial one.
        </p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <a href="https://gamoola.com" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: "13px", color: "#059669", fontWeight: "600", textDecoration: "none" }}>
            🌐 gamoola.com
          </a>
          <a href="mailto:lotus@gamoola.com"
            style={{ fontSize: "13px", color: "#059669", fontWeight: "600", textDecoration: "none" }}>
            📧 lotus@gamoola.com
          </a>
        </div>
      </div>

      <div style={{ background: "#f9fafb", border: "0.5px solid #e5e7eb",
        borderRadius: "12px", padding: "14px 16px", marginBottom: "14px" }}>
        <p style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 8px" }}>📋 Disclaimer</p>
        <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, lineHeight: 1.8 }}>
          This app was created for personal, non-commercial use to support one student's GCSE revision.
          It is not affiliated with or endorsed by Edexcel or Pearson. If you are the owner of any content
          featured here and would like it removed, please get in touch at{" "}
          <a href="mailto:lotus@gamoola.com" style={{ color: "#6b7280" }}>lotus@gamoola.com</a>.
        </p>
      </div>

      <p style={{ fontSize: "13px", color: "#9ca3af", textAlign: "center", marginTop: "8px" }}>
        Built with ❤️ for Scarlett — good luck in your exams! 🌟
      </p>

    </div>
  );
}