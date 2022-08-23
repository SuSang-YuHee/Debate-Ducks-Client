import Image from "next/image";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { FiEdit, FiCheckSquare, FiXSquare } from "react-icons/fi";
import { useRouter } from "next/router";

import {
  useGetUser,
  usePatchUserImage,
  usePatchUserNickname,
} from "../../utils/queries/users";
import { removeSpace } from "../../utils/common/removeSpace";
import styles from "./MyPage.module.scss";

import Error from "../../components/common/Error";
import ChangePasswordModal from "../../components/common/modal/ChangePasswordModal";
import SignOutModal from "../../components/common/modal/SignOutModal";

export default function MyPagePage() {
  const router = useRouter();
  const [image, setImage] = useState<File>();
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  const [formData, setFormData] = useState<FormData>();
  const [isEdit, setIsEdit] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isValidationShow, setIsValidationShow] = useState(false);
  const [isPasswordModalOn, setIsPasswordModalOn] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const user = useGetUser();
  const patchUserImage = usePatchUserImage(user.data?.id || "", formData);
  const patchUserNickname = usePatchUserNickname(user.data?.id || "", nickname);

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

  const handleChangeNickname = (e: BaseSyntheticEvent) => {
    const nickname = removeSpace(e.target.value);
    if (
      (nickname.length >= 1 && nickname.length < 2) ||
      nickname.length >= 16 ||
      /[^\s\w가-힣]/.test(nickname)
    ) {
      setIsValidationShow(true);
    } else {
      setIsValidationShow(false);
      setNickname(nickname);
    }
  };

  const handleImageSave = () => {
    if (user.data) {
      patchUserImage.mutate();
      setIsValidationShow(false);
    }
  };

  const handleNicknameSave = () => {
    if (user.data) {
      patchUserNickname.mutate();
      setIsEdit(false);
    }
  };

  const handleNicknameEdit = () => {
    setIsEdit(true);
  };

  const handleNicknameEditCancel = () => {
    setIsEdit(false);
  };

  const handlePushSignIn = () => {
    router.push("/signin");
  };

  const handleCancel = () => {
    setFormData(undefined);
    setPreviewImageUrl("");
  };

  const stopEvent = (e: BaseSyntheticEvent) => {
    e.preventDefault();
  };

  if (user.isError) return <Error />;
  return (
    <>
      {isPasswordModalOn ? (
        <ChangePasswordModal
          cancelFunc={() => {
            setIsPasswordModalOn(false);
          }}
        />
      ) : null}
      <SignOutModal
        isSignOutModalOpen={isSignOutModalOpen}
        setIsSignOutModalOpen={setIsSignOutModalOpen}
      />
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.wrapper}>
            <div className={styles.profile_container}>
              <div className={styles.image_wrapper}>
                <Image
                  className={styles.image}
                  alt="profile_image"
                  src={
                    !user.data
                      ? "/images/profiles/default-gray.png"
                      : previewImageUrl
                      ? previewImageUrl
                      : user.data?.profile_image !== "temp default image"
                      ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.data?.profile_image}`
                      : "/images/profiles/default-green.png"
                  }
                  width="300"
                  height="300"
                  unoptimized={true}
                />
                {user.data ? (
                  <form
                    encType="multipart/form-data"
                    onSubmit={stopEvent}
                    className={styles.form}
                  >
                    <label htmlFor="input-file" className={styles.file_btn}>
                      <FiEdit />
                      <span>수정</span>
                    </label>
                    <input
                      type="file"
                      id="input-file"
                      onChange={handleChangeImage}
                    />
                  </form>
                ) : (
                  <div className={styles.form}>
                    <div className={styles.file_btn} onClick={handlePushSignIn}>
                      로그인
                    </div>
                  </div>
                )}
              </div>
              {user.data && formData && previewImageUrl ? (
                <>
                  <button className={styles.save_btn} onClick={handleImageSave}>
                    <FiCheckSquare />
                    <span>저장</span>
                  </button>
                  <button
                    className={`${styles.save_btn} ${styles.save_btn_cons}`}
                    onClick={handleCancel}
                  >
                    <FiXSquare />
                    <span>취소</span>
                  </button>
                </>
              ) : null}
            </div>
            {user.data ? (
              <div className={styles.info_container}>
                <div className={styles.name_wrapper}>
                  {isEdit ? (
                    <div className={styles.name}>
                      {isValidationShow ? (
                        <div className={styles.validation}>
                          이름은 낱자를 제외한 한글, 영어, 숫자만 포함 가능하며
                          2자 이상, 15자 이하여야 합니다.
                        </div>
                      ) : null}
                      <input
                        className={styles.input}
                        placeholder={user.data?.nickname}
                        onChange={handleChangeNickname}
                      />
                      {isValidationShow ? null : (
                        <button
                          onClick={handleNicknameSave}
                          className={styles.save}
                        >
                          <FiCheckSquare />
                        </button>
                      )}
                      <button
                        onClick={handleNicknameEditCancel}
                        className={styles.cancel}
                      >
                        <FiXSquare />
                      </button>
                    </div>
                  ) : (
                    <div className={styles.name}>
                      <div className={styles.nickname}>
                        {user.data.nickname}
                      </div>
                      <button
                        onClick={handleNicknameEdit}
                        className={styles.edit}
                      >
                        <FiEdit />
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.email}>{user.data.email}</div>

                <div
                  className={styles.password}
                  onClick={() => setIsPasswordModalOn(true)}
                >
                  비밀번호 변경
                </div>
                <div
                  className={styles.unsubscribe}
                  onClick={() => {
                    setIsSignOutModalOpen(true);
                  }}
                >
                  로그아웃
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
