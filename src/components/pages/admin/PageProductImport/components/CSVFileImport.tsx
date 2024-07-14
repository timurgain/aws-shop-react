import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  React.useEffect(() => {
    // ! just for educational purposes
    const basic_auth_token_hardcoded = "dGltdXJnYWluOlRFU1RfUEFTU1dPUkQ=";
    localStorage.setItem("authorization_token", basic_auth_token_hardcoded);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const handleAPIError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      if (statusCode === 401) {
        alert(
          "Error 401: Unauthorized. Check the 'authorization_token' in your browser's local storage"
        );
      } else if (statusCode === 403) {
        alert("Error 403: Forbidden. You are not allowed to upload files");
      } else {
        alert(`Error uploading the file: ${error.message}`);
      }
    }
  };

  const uploadFile = async () => {
    const authorizationToken = localStorage.getItem("authorization_token");
    const fileName = file ? file.name : "";

    try {
      // Get the presigned URL for S3

      const presignedURL = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(fileName),
        },
        headers: authorizationToken
          ? {
              Authorization: `Basic ${authorizationToken}`,
            }
          : {},
      });

      // Upload the file to S3

      await axios({
        method: "PUT",
        url: presignedURL.data,
        data: file,
      });

      alert("File uploaded successfully");
      setFile(undefined);
    } catch (error) {
      handleAPIError(error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
