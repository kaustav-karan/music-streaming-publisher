import { useFormik } from "formik";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";
import UploadProgress from "./UploadProgress";
import { uploadSong } from "../api/song";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  artist: Yup.string().required("Artist is required"),
  song: Yup.mixed().required("Audio file is required"),
});

const SongUploadForm = () => {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      artist: "",
      song: null as File | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("artist", values.artist);
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
      "audio/mpeg": [".mp3"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      formik.setFieldValue("song", acceptedFiles[0]);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mb-[15px]">
        <label htmlFor="title" className="text-lg font-semibold tracking-wider">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Enter Track Title"
          onChange={formik.handleChange}
          value={formik.values.title}
          className="w-full p-[8px] border-2 rounded-md box-border"
          onBlur={formik.handleBlur}
        />
        {formik.errors.title && formik.touched.title && (
          <div className="text-[red] text-base mt-[5px]">
            {formik.errors.title}
          </div>
        )}
      </div>

      <div className="mb-[15px]">
        <label
          htmlFor="artist"
          className="text-lg font-semibold tracking-wider"
        >
          Artist
        </label>
        <input
          id="artist"
          name="artist"
          type="text"
          placeholder="Enter Artist Name"
          onChange={formik.handleChange}
          value={formik.values.artist}
          className="w-full p-[8px] border-2 rounded-md box-border"
          onBlur={formik.handleBlur}
        />
        {formik.errors.artist && formik.touched.artist && (
          <div className="text-[red] text-base mt-[5px]">
            {formik.errors.artist}
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
