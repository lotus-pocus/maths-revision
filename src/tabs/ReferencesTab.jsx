export default function ReferencesTab() {
  const refs = [
    { label: "Edexcel GCSE Mathematics Specification (1MA1)", url: "https://qualifications.pearson.com/en/qualifications/edexcel-gcses/mathematics-2015.html" },
    { label: "Edexcel GCSE Maths Past Papers", url: "https://qualifications.pearson.com/en/qualifications/edexcel-gcses/mathematics-2015.coursematerials.html" },
    { label: "Hegarty Maths", url: "https://hegartymaths.com" },
    { label: "BBC Bitesize GCSE Maths", url: "https://www.bbc.co.uk/bitesize/examspecs/z8sh242" },
    { label: "Mymaths", url: "https://www.mymaths.co.uk" },
    { label: "Corbettmaths", url: "https://corbettmaths.com" },
  ];
  return (
    <div style={{ paddingBottom: "2rem" }}>
      <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px", lineHeight: 1.6 }}>
        Curriculum sources and recommended revision resources.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {refs.map(({ label, url }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
              gap: "12px", background: "#fff", border: "0.5px solid #e5e7eb",
              borderRadius: "10px", padding: "12px 14px",
              textDecoration: "none", color: "#1a1a2e" }}>
            <span style={{ fontSize: "13px", fontWeight: "500" }}>{label}</span>
            <span style={{ color: "#9ca3af", flexShrink: 0 }}>↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}