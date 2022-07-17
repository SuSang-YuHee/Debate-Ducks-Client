export default function ConfirmModal({
  title,
  content,
  firstBtn,
  firstFunc,
  secondBtn,
  secondFunc,
}: {
  title: string;
  content: string;
  firstBtn: string;
  firstFunc: () => void;
  secondBtn?: string;
  secondFunc?: () => void;
}) {
  const handleCancel = () => {
    firstFunc();
  };

  const handleConfirm = () => {
    if (secondFunc) secondFunc();
  };

  return (
    <div>
      {title}
      {content}
      <button onClick={handleCancel}>{firstBtn}</button>
      {secondBtn ? <button onClick={handleConfirm}>{secondBtn}</button> : null}
    </div>
  );
}
