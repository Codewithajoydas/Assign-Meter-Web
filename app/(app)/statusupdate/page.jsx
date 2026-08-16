"use client";
import { useState, useRef } from "react";
import * as XLSX from "xlsx";

export default function StatusUpdatePage() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100
  const xhrRef = useRef(null); // lets us cancel an in-flight upload if needed

  const processFile = async (file) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      console.log("Excel Data:", jsonData);

      return jsonData;
    } catch (err) {
      console.error("Error reading file:", err);
      return null;
    }
  };

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;

    if (
      !selectedFile.name.endsWith(".xlsx") &&
      !selectedFile.name.endsWith(".xls")
    ) {
      alert("Only Excel files allowed");
      return;
    }

    setFile(selectedFile);
    setProgress(0);
    await processFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };

  /**
   * fetch() has no upload-progress event — the browser Fetch API only
   * exposes a readable stream for the *response* body, not the request
   * body, so there's no hook to report "X% of the file has been sent."
   * XMLHttpRequest still does, via `upload.onprogress`, so we wrap it
   * in a promise to keep the rest of the component async/await-friendly.
   */
  const uploadWithProgress = (formData) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.open("POST", "/api/updatestatus"); // leading slash: always resolves from site root

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const pct = Math.round((event.loaded / event.total) * 100);
          setProgress(pct);
        }
      };

      xhr.onload = () => {
        xhrRef.current = null;
        let data;
        try {
          data = JSON.parse(xhr.responseText);
        } catch (parseErr) {
          reject(new Error("Server returned an invalid response"));
          return;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ status: xhr.status, data });
        } else {
          reject(
            Object.assign(new Error(data?.error || "Upload failed"), {
              status: xhr.status,
              data,
            }),
          );
        }
      };

      xhr.onerror = () => {
        xhrRef.current = null;
        reject(new Error("Network error during upload"));
      };

      xhr.onabort = () => {
        xhrRef.current = null;
        reject(new Error("Upload cancelled"));
      };

      xhr.send(formData);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Select a file first");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await uploadWithProgress(formData);
      console.log("Server response:", data);
      alert("Upload successful");
    } catch (err) {
      console.error(err);
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    xhrRef.current?.abort();
    setLoading(false);
    setProgress(0);
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col justify-center items-center w-[400px] cursor-pointer ${
          dragging ? "bg-blue-100 border-blue-500" : ""
        }`}
        style={{
          padding: 30,
          gap: 20,
          border: "2px dashed",
          borderColor: dragging ? "blue" : "gray",
          borderRadius: 10,
          width: 400,
        }}
      >
        <img src="/upload-icon.png" alt="Upload" width={70} height={70} />

        <span className="text-center">
          <p>Drop your File Here, or Browse</p>
          <p className="text-sm text-gray-500">
            Only Excel files (.xlsx, .xls)
          </p>

          <input
            type="file"
            onChange={handleChange}
            className="hidden"
            id="fileInput"
            hidden
          />

          <label htmlFor="fileInput">
            <div
              style={{
                background: "#000",
                color: "#fff",
                borderRadius: 10,
                padding: 10,
                marginTop: 10,
              }}
            >
              Choose File
            </div>
          </label>
        </span>

        {file && (
          <p className="text-sm">
            Selected: <strong>{file.name}</strong>
          </p>
        )}

        {loading && (
          <div style={{ width: "100%" }}>
            <div
              style={{
                width: "100%",
                height: 8,
                background: "#e5e7eb",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "#2563eb",
                  transition: "width 150ms ease-out",
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{progress}%</span>
              <button
                type="button"
                onClick={handleCancel}
                className="underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600"
          style={{
            color: "#fff",
            borderRadius: 10,
            padding: 10,
            width: "100%",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? `Uploading... ${progress}%` : "Upload to Server"}
        </button>
        <a
          href="/Meter-Assign-Template.xlsx"
          download={"meter-assign-template.xls"}
        >
          <button className="text-sm text-gray-500 hover:underline">
            Download Template
          </button>
        </a>
      </div>
    </div>
  );
}