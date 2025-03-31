import React from "react";

interface UploadProgressProps {
  progress: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress }) => {
  return (
    <div className="upload-progress">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      <span>{progress}%</span>
    </div>
  );
};

export default UploadProgress;
