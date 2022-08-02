import Image from "next/image";
import { useGetUser } from "../../utils/queries/users";
import styles from "./MyPage.module.scss";
import { BaseSyntheticEvent, useState } from "react";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/router";

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
      axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.data.id}/upload`,
        formData,
        { headers: { "content-type": "multipart/form-data" } },
      );
    }
  };
  const stopEvent = (e: BaseSyntheticEvent) => {
    e.preventDefault();
  };
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.wrapper}>
          <div className={styles.profile_container}>
            <div className={styles.image_wrapper}>
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
            </div>
            <form
              encType="multipart/form-data"
              onSubmit={stopEvent}
              className={styles.form}
            >
              <label htmlFor="input-file" className={styles.file_btn}>
                <FiEdit />
                <span>수정</span>
              </label>
              <input type="file" id="input-file" onChange={handleChangeImage} />
            </form>
          </div>
          <div className={styles.info_container}>
            <div className={styles.name_wrapper}>
              {user.data ? (
                <input
                  className={styles.name}
                  placeholder={user.data.nickname}
                />
              ) : null}
              <div className={styles.icon_wrapper}>
                <FiEdit />
              </div>
            </div>
            {user.data ? (
              <div className={styles.email}>{user.data.email}</div>
            ) : null}
          </div>
        </div>
        <button className={styles.save_btn} onClick={handleImageSave}>
          저장
        </button>
      </div>
    </div>
  );
}
