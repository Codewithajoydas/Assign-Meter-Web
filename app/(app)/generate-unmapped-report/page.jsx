"use client";

import { Download } from "lucide-react";
import { useState } from "react";

const REPORT_META = {
  comm: {
    tag: "RPT / COMM",
    title: "Communication Report",
    desc: "Connectivity and last-seen status across all meters.",
  },
  issue: {
    tag: "RPT / ISSUE",
    title: "Meter Issue Report",
    desc: "Faults and flagged statuses from bulk uploads.",
  },
  mi: {
    tag: "RPT / MI",
    title: "MI Report",
    desc: "Rolled-up management summary across the fleet.",
  },
};

export default function GenerateUnmappedReportPage() {
  // Holds the three selected files, keyed by report type
  const [files, setFiles] = useState({
    comm: null,
    issue: null,
    mi: null,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState("");

  const filledCount = Object.values(files).filter(Boolean).length;
  const allFilesReady = filledCount === 3;

  // Update a single file slot when the user picks a file
  const handleFileChange = (type, file) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  // Send all three files to the backend and trigger a CSV download
  const generateReport = async () => {
    if (!allFilesReady) return;

    setIsGenerating(true);
    setStatusText("Generating…");

    try {
      const formData = new FormData();
      formData.append("comm", files.comm);
      formData.append("issue", files.issue);
      formData.append("mi", files.mi);

      const res = await fetch("http://localhost:9000/api/generateReport", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "unmapped_report.csv";
        a.click();
        URL.revokeObjectURL(url);
        setStatusText("Unmapped report generated");
      } else {
        setStatusText("Failed to generate report");
      }
    } catch (err) {
      console.error(err);
      setStatusText("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.pageHead}>
        <div style={styles.eyebrow}>Meter Management &middot; Reports</div>
        <h1 style={styles.h1}>Generate an unmapped report</h1>
        <p style={styles.headParagraph}>
          Attach all three source files, then generate.
        </p>
        <a href="https://assign-meter-backend.onrender.com/api/last-unmapped-report" style={styles.lastReportLink}>
          <Download size={20} />Download last unmapped report
        </a>
      </div>

      <div style={styles.board}>
        {Object.keys(REPORT_META).map((type) => (
          <ReportCard
            key={type}
            type={type}
            file={files[type]}
            onFileChange={(file) => handleFileChange(type, file)}
          />
        ))}
      </div>

      <div style={styles.footerBar}>
        <div style={styles.footerStatus}>
          {statusText ||
            (allFilesReady
              ? "All 3 files attached — ready to generate"
              : `${filledCount} of 3 files attached`)}
        </div>
        <button
          style={{
            ...styles.generateBtn,
            ...(allFilesReady && !isGenerating ? {} : styles.generateBtnDisabled),
          }}
          disabled={!allFilesReady || isGenerating}
          onClick={generateReport}
        >
          {isGenerating ? "Generating…" : "Generate unmapped report"}
          <ArrowIcon />
        </button>
      </div>
    </div>
  );
}

// Single report card: icon, check-mark, description, and file picker
function ReportCard({ type, file, onFileChange }) {
  const meta = REPORT_META[type];
  const filled = Boolean(file);

  return (
    <div
      style={{
        ...styles.card,
        ...(filled ? styles.cardFilled : {}),
      }}
    >
      <div style={styles.cardTop}>
        <div
          style={{
            ...styles.iconWell,
            ...(filled ? styles.iconWellFilled : {}),
          }}
        >
          <CardIcon type={type} />
        </div>
        <div
          style={{
            ...styles.checkMark,
            ...(filled ? styles.checkMarkFilled : {}),
          }}
        >
          <CheckIcon />
        </div>
      </div>

      <span style={styles.tag}>{meta.tag}</span>
      <h2 style={styles.cardTitle}>{meta.title}</h2>
      <p style={styles.cardDesc}>{meta.desc}</p>

      <label
        style={{
          ...styles.fileSelect,
          ...(filled ? styles.fileSelectFilled : {}),
        }}
      >
        <UploadIcon />
        <span
          style={{
            ...styles.fileName,
            ...(filled ? styles.fileNameFilled : {}),
          }}
        >
          {file ? file.name : "Select file"}
        </span>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          style={{ display: "none" }}
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}

function CardIcon({ type }) {
  if (type === "comm") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12a8 8 0 0 1 16 0" />
        <path d="M7 12a5 5 0 0 1 10 0" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <path d="M12 13.6V19" />
      </svg>
    );
  }
  if (type === "issue") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 2 20h20L12 3Z" />
        <path d="M12 10v4" />
        <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V10M11 19V5M18 19v-7" />
      <path d="M2 19h20" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L19 7" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
      <path d="M12 3v12" />
      <path d="M7 8l5-5 5 5" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={15} height={15}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// Inline style objects (swap for CSS modules / Tailwind if preferred)
const styles = {
  body: {
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
    color: "#1b1e1c",
    padding: "64px 24px 90px",
  },
  pageHead: { maxWidth: 980, margin: "0 auto 44px" },
  eyebrow: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11.5,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#767b73",
  },
  lastReportLink:{
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    fontSize: 13,
    color: "#2f5d50",
    textDecoration: "underline",
  },
  h1: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "clamp(26px, 3.6vw, 36px)",
    margin: "12px 0 8px",
    letterSpacing: "-0.01em",
  },
  headParagraph: {
    color: "#767b73",
    fontSize: 14.5,
    maxWidth: 540,
    lineHeight: 1.6,
    margin: 0,
  },
  board: {
    maxWidth: 980,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
  },
  card: {
    position: "relative",
    background: "#ffffff",
    border: "1px solid #e2e4de",
    borderRadius: 12,
    padding: "22px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  },
  cardFilled: {
    borderColor: "#2f5d50",
    boxShadow: "0 0 0 1px #2f5d50",
  },
  cardTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  iconWell: {
    width: 36,
    height: 36,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e2e4de",
    color: "#767b73",
    padding: 4,
  },
  iconWellFilled: {
    borderColor: "#2f5d50",
    color: "#2f5d50",
    background: "rgba(47, 93, 80, 0.07)",
  },
  checkMark: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    border: "1.5px solid #c9ccc4",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "transparent",
  },
  checkMarkFilled: {
    borderColor: "#2f5d50",
    background: "#2f5d50",
    color: "#fff",
  },
  tag: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5,
    letterSpacing: "0.07em",
    color: "#767b73",
  },
  cardTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 17,
    fontWeight: 600,
    margin: 0,
  },
  cardDesc: {
    margin: "-6px 0 0",
    fontSize: 13,
    lineHeight: 1.55,
    color: "#767b73",
  },
  fileSelect: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px dashed #c9ccc4",
    borderRadius: 8,
    padding: "9px 10px",
    fontSize: 12.5,
    color: "#767b73",
    cursor: "pointer",
  },
  fileSelectFilled: {
    borderColor: "#2f5d50",
    borderStyle: "solid",
    background: "rgba(47, 93, 80, 0.07)",
  },
  fileName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  fileNameFilled: { color: "#1b1e1c" },
  footerBar: {
    maxWidth: 980,
    margin: "32px auto 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  footerStatus: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12.5,
    color: "#767b73",
  },
  generateBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "13px 22px",
    borderRadius: 9,
    border: "1px solid #2f5d50",
    background: "#2f5d50",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  generateBtnDisabled: {
    opacity: 0.35,
    cursor: "not-allowed",
  },
};