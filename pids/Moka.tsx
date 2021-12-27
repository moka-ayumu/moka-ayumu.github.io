import type { NextPage } from "next";
import styles from "../styles/Home.module.scss";
import anime from "animejs";
import { RefObject, useEffect } from "react";

const Moka: NextPage<{ nameRef: RefObject<HTMLDivElement> }> = ({
  nameRef,
}) => {
  useEffect(() => {
    nameAnime();
  }, []);

  const nameAnime = () => {
    let nameObj = { count: 0 };
    const nameP: HTMLParagraphElement = nameRef.current
      ?.children[0] as HTMLParagraphElement;
    const name = ["M", "O", "K", "A\n", "A", "Y", "U", "M", "U"];
    anime({
      targets: nameObj,
      count: 18,
      round: 1,
      duration: 2000,
      easing: "easeOutQuart",
      direction: "alternate",
      loop: true,
      update: () => {
        nameP.innerText =
          name.slice(0, nameObj.count / 2).join("") +
          (nameObj.count % 2 === 1 ? "|" : "");
      },
    });
  };

  return (
    <main className={styles.page}>
      <a
        href="/license.txt"
        target="_blank"
        className="absolute right-5 top-3 font-title text-cyan-700 hover:text-cyan-500 transition-colors cursor-pointer"
      >
        License
      </a>
      <div className={styles.name} ref={nameRef}>
        <h1></h1>
        <p>Learning and using new skills is my life's pleasure.</p>
      </div>
      <p className="absolute left-1/2 -translate-x-1/2 top-3/4 font-title text-center text-3xl text-cyan-700 hover:text-cyan-500 transition-colors">
        Try Scroll / Swipe → <br /> This is WIP.
      </p>
    </main>
  );
};

export default Moka;
