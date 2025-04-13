import { useFormik } from "formik";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";
import UploadProgress from "./UploadProgress";
import { uploadSong } from "../api/song";

const validationSchema = Yup.object().shape({
  fileName: Yup.string().required("Title is required"),
  publisherName: Yup.string().required("Publisher is required"),
  song: Yup.mixed().required("Audio file is required"),
});

const SongUploadForm = () => {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      fileName: "",
      publisherName: "",
      song: null as File | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append("title", values.fileName);
        formData.append("publisherName", values.publisherName);
        formData.append("song", values.song as File);

        await uploadSong(formData, (percent) => {
          setProgress(percent);
        });

        setSuccess(true);
        formik.resetForm();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setProgress(null);
      }
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "audio/mpeg": [".mp3", ".mpeg"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      formik.setFieldValue("song", acceptedFiles[0]);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mb-[15px]">
        <label htmlFor="fileName" className="text-lg font-semibold tracking-wider">
          fileName
        </label>
        <input
          id="fileName"
          name="fileName"
          type="text"
          placeholder="Enter Track Name"
          onChange={formik.handleChange}
          value={formik.values.fileName}
          className="w-full p-[8px] border-2 rounded-md box-border"
          onBlur={formik.handleBlur}
        />
        {formik.errors.fileName && formik.touched.fileName && (
          <div className="text-[red] text-base mt-[5px]">
            {formik.errors.fileName}
          </div>
        )}
      </div>

      <div className="mb-[15px]">
        <label
          htmlFor="publisherName"
          className="text-lg font-semibold tracking-wider"
        >
          publisherName
        </label>
        <input
          id="publisherName"
          name="publisherName"
          type="text"
          placeholder="Enter Publisher Name"
          onChange={formik.handleChange}
          value={formik.values.publisherName}
          className="w-full p-[8px] border-2 rounded-md box-border"
          onBlur={formik.handleBlur}
        />
        {formik.errors.publisherName && formik.touched.publisherName && (
          <div className="text-[red] text-base mt-[5px]">
            {formik.errors.publisherName}
          </div>
        )}
      </div>

      <div
        {...getRootProps()}
        className="border-[2px] border-b-blue-950 rounded-2xl p-[20px] text-center mx-[0] my-[20px] cursor-pointer"
      >
        <input {...getInputProps()} className="w-full p-[8px] box-border" />
        {formik.values.song ? (
          <p>{formik.values.song.name}</p>
        ) : (
          <p>Drag & drop an MP3 file here, or click to select</p>
        )}
      </div>
      {formik.errors.song && (
        <div className="text-[red] text-base mt-[5px]">
          {formik.errors.song}
        </div>
      )}

      {progress !== null && <UploadProgress progress={progress} />}

      {error && <div className="text-[red] mx-[0] my-[10px]">{error}</div>}
      {success && (
        <div className="text-[green] mx-[0] my-[10px]">Upload successful!</div>
      )}

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className={`w-full py-2 px-4 rounded-md text-white font-semibold tracking-wide ${
          formik.isSubmitting
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        Upload Song
      </button>
    </form>
  );
};

export default SongUploadForm;
