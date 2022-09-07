import Image from "next/image";
import { useRouter } from "next/router";

import styles from "./Error.module.scss";

export default function Error() {
  const router = useRouter();

  return (
    <div className={`inner ${styles.outer}`}>
      <div className={`${styles.box}`}>
        <div className={styles.message_top}>{"SORRY"}</div>
        <div className={styles.message_bottom}>
          {"we couldn't find that page"}
        </div>
        <div
          className={styles.btn}
          onClick={() => {
            router.push("/");
          }}
        >
          {"Go to homepage"}
        </div>
        <Image
          src={"/images/duckling.webp"}
          alt={"duckling"}
          width={400}
          height={400}
          priority={true}
        />
      </div>
    </div>
  );
}
