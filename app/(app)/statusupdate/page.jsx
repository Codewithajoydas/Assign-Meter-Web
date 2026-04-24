"use client";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function StatusUpdatePage() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

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

    // Basic validation
    if (
      !selectedFile.name.endsWith(".xlsx") &&
      !selectedFile.name.endsWith(".xls")
    ) {
      alert("Only Excel files allowed");
      return;
    }

    setFile(selectedFile);
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

  const handleUpload = async () => {
    if (!file) {
      alert("Select a file first");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("api/updatestatus", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (res.ok) {
        alert("Upload successful");
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

    setLoading(false);
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

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600"
          style={{
            color: "#fff",
            borderRadius: 10,
            padding: 10,
            width: "100%",
          }}
        >
          {loading ? "Uploading..." : "Upload to Server"}
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
