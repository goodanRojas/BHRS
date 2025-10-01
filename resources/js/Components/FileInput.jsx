import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function FileInput({
  label,
  accept = "image/*",
  field,
  error,
  onFileChange,
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      onFileChange?.(e);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      onFileChange?.({ target: { files: [droppedFile] } });
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    fileInputRef.current.value = "";
  };

  return (
    <div className="w-full space-y-2">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition 
          ${error ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"}`}
      >
        {!preview ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <FontAwesomeIcon
              icon={faCloudUploadAlt}
              className="text-indigo-500 text-4xl"
            />
            <p className="text-gray-600 text-sm">
              Drag & Drop or <span className="text-indigo-600 font-semibold">Click to Upload</span>
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, JPEG (Max 5MB)</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative inline-block"
            >
              <img
                src={preview}
                alt="preview"
                className="max-h-48 mx-auto rounded-xl shadow-md"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow hover:bg-red-600 transition"
              >
                <FontAwesomeIcon icon={faTimes} size="sm" />
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
