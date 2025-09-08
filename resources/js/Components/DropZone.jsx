// resources/js/Components/QrUploader.jsx

import React, { useState, useEffect } from "react";

export default function DropZone({
  value,          // existing QR from DB (url string)
  onChange,       // callback for file select
  error,          // validation error string
  label = "Upload QR Code", // label text
}) {
  const [preview, setPreview] = useState(null);

  // Show existing QR if available
  useEffect(() => {
    if (typeof value === "string" && value) {
      setPreview(value.startsWith("blob:") ? value : `/storage/${value}`);
    }
  }, [value]);

  const handleFile = (file) => {
    if (file) {
      onChange(file); // pass file back to parent form (setData)
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">
        {label}
      </label>

      {/* Drop zone */}
      <div
        className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition"
        onClick={() => document.getElementById("qr-upload").click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H20a4 4 0 00-4 4v24a4 4 0 004 4h8a4 4 0 004-4V12a4 4 0 00-4-4z"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 16h24M12 32h24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600 justify-center">
            <span className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
        </div>
      </div>

      {/* Hidden input */}
      <input
        id="qr-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {/* Preview */}
      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Preview</p>
          <div className="w-44 h-44 border border-gray-200 rounded-xl shadow-sm flex items-center justify-center overflow-hidden bg-gray-50">
            <img
              src={preview}
              alt="QR Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
