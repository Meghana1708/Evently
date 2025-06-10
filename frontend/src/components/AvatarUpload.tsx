import React, { useRef } from "react";
import axios from "axios";

type AvatarUploadProps = {
  onUploaded: (url: string) => void;
};

export default function AvatarUpload({ onUploaded }: AvatarUploadProps) {
  const fileInput = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = localStorage.getItem("token");
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await axios.post(
      "http://localhost:5001/api/user/avatar",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );
    onUploaded(res.data.avatarUrl);
  };

  return (
    <input
      type="file"
      accept="image/*"
      ref={fileInput}
      style={{ display: "none" }}
      onChange={handleFileChange}
    />
  );
}