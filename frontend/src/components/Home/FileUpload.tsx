import { Button, FormControl, Input } from "@chakra-ui/react";
import React from "react";
import { useDropzone } from "react-dropzone";

function FileUpload() {
  const { getRootProps, getInputProps, open, isDragActive, } = useDropzone({
    noClick: true,
  });

  const ondragenter = () => {
  }
  return (
    <FormControl
      {...getRootProps}
      h="auto"
      minHeight={300}
      borderStyle="dashed"
      borderWidth={3}
      borderColor={isDragActive ? "teal" : "gray"}
    >
      FileUpload
      <Input type="file" {...getInputProps} display="none" />
      <Button onClick={open}>upload file</Button>
    </FormControl>
  );
}

export default FileUpload;
