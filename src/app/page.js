import FileUpload from "@/components/fileUpload";

export default function Home() {
  return (
    <div>
      <h1>Upload a File to S3</h1>
      <FileUpload />
    </div>
  );
}
