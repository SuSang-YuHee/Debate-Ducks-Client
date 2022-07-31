import Image from "next/image";
import { useGetUser } from "../../utils/queries/users";
import styles from "../../styles/MyPage.module.scss";
import { BaseSyntheticEvent, useState } from "react";
import axios from "axios";

export default function MyPage() {
  const [image, setImage] = useState<File>();
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  const user = useGetUser();
  console.log(user);
  const handleChangeImage = (e: BaseSyntheticEvent) => {
    setImage(e.target.files[0]);
    const srcUrl = window.URL.createObjectURL(e.target.files[0]);
    setPreviewImageUrl(srcUrl);
  };
  const handleImageSave = () => {
    const formData = new FormData();
    if (image) {
      formData.append("file", image);
    }
    if (user.data) {
      axios
        .patch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${user.data.id}/upload`,
          formData,
          { headers: { "content-type": "multipart/form-data" } },
        )
        .then(() => setPreviewImageUrl(""));
    }
  };
  const handleImageCancel = () => {
    setPreviewImageUrl("");
    setImage(undefined);
  };
  const stopEvent = (e: BaseSyntheticEvent) => {
    e.preventDefault();
  };
  return (
    <div className={styles.container}>
      {user.data ? (
        <Image
          className={styles.image}
          alt="profile_image"
          src={
            previewImageUrl
              ? previewImageUrl
              : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.data?.profile_image}`
          }
          width="300"
          height="300"
          unoptimized={true}
        />
      ) : null}
      {user.data ? <div>{user.data.nickname}</div> : null}
      {user.data ? <div>{user.data.email}</div> : null}
      <form encType="multipart/form-data" onSubmit={stopEvent}>
        <input type="file" onChange={handleChangeImage} />
        <button onClick={handleImageSave}>저장</button>
        <button onClick={handleImageCancel}>취소</button>
      </form>
      {/* {previewImageUrl ? (
        <Image width="300" height="300" alt="preview" src={previewImageUrl} />
      ) : null} */}
    </div>
  );
}
