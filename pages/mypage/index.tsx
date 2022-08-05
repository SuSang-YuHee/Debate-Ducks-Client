import Image from "next/image";
import { useGetUser, usePatchUserImage } from "../../utils/queries/users";
import styles from "./MyPage.module.scss";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
// import { useRouter } from "next/router";

export default function MyPage() {
  const [image, setImage] = useState<File>();
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  const [formData, setFormData] = useState<FormData>();
  const user = useGetUser();
  const patchUserImage = usePatchUserImage(user.data?.id || "", formData);

  useEffect(() => {
    const formData = new FormData();
    if (image) {
      formData.append("file", image);
      setFormData(formData);
    }
  }, [image]);

  const handleChangeImage = (e: BaseSyntheticEvent) => {
    setImage(e.target.files[0]);
    const srcUrl = window.URL.createObjectURL(e.target.files[0]);
    setPreviewImageUrl(srcUrl);
  };

  const handleImageSave = () => {
    if (user.data) {
      patchUserImage.mutate();
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
            <button className={styles.save_btn} onClick={handleImageSave}>
              저장
            </button>
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
      </div>
    </div>
  );
}
