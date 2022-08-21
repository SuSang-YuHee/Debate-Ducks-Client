import Image from "next/image";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { FiEdit, FiCheckSquare, FiXSquare } from "react-icons/fi";

import {
  useGetUser,
  usePatchUserImage,
  usePatchUserNickname,
} from "../../utils/queries/users";
import styles from "./MyPage.module.scss";

import Error from "../../components/common/Error";
import ChangePasswordModal from "../../components/common/modal/ChangePasswordModal";
import SignOutModal from "../../components/common/modal/SignOutModal";

// Todo: 이름 유효성 검사(회원가입에서도 필요), createObjectURL 에러 해결, 페이지 접근 권한 설정, 프로필 변경 취소 버튼 제작 / 이름 변경 시 사진 밀리는거 해결, 인풋에 기존 아이디 유지 및 placeholder 색 구분
export default function MyPagePage() {
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
    if (
      (e.target.value.length >= 1 && e.target.value.length < 2) ||
      e.target.value.length >= 16
    ) {
      setIsValidationShow(true);
    } else {
      setIsValidationShow(false);
      setNickname(e.target.value);
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
                {user.data ? (
                  <Image
                    className={styles.image}
                    alt="profile_image"
                    src={
                      previewImageUrl
                        ? previewImageUrl
                        : user.data?.profile_image !== "temp default image"
                        ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.data?.profile_image}`
                        : "/images/profiles/default-green.png"
                    }
                    width="300"
                    height="300"
                    unoptimized={true}
                  />
                ) : null}
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
              </div>
              <button className={styles.save_btn} onClick={handleImageSave}>
                <FiCheckSquare />
                <span>저장</span>
              </button>
            </div>
            <div className={styles.info_container}>
              <div className={styles.name_wrapper}>
                {isEdit ? (
                  <div className={styles.name}>
                    {isValidationShow ? (
                      <div className={styles.validation}>
                        이름은 2자 이상 15자 이하로 만들어 주세요.
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
                ) : user.data ? (
                  <div className={styles.name}>
                    <div className={styles.nickname}>{user.data.nickname}</div>
                    <button
                      onClick={handleNicknameEdit}
                      className={styles.edit}
                    >
                      <FiEdit />
                    </button>
                  </div>
                ) : null}
              </div>
              {user.data ? (
                <div className={styles.email}>{user.data.email}</div>
              ) : null}
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
          </div>
        </div>
      </div>
    </>
  );
}
