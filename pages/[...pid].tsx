import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import anime from "animejs";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Moka from "../pids/Moka";
import ChumeWeb from "../pids/ChumeWeb";
import BgCanvas from "../components/BgCanvas";
import HoloP from "../pids/HoloP";
import ERELIZA from "../pids/ER-ELIZA";
import ChumeDebut from "../pids/ChumeDebut";

const pids = ["moka", "ChumeWeb", "ChumeDebut", "HoloP", "ER-ELIZA"];
const Home: NextPage = () => {
  const router = useRouter();
  const { pid } = router.query;
  const nameRef = useRef<HTMLDivElement>(null);
  const nowPid = useRef<number>(0);
  const wheelDirection = useRef<number>(0);

  useEffect(() => {
    const overflowElements = Array.from(
      document.querySelectorAll(".overflow-auto")
    );
    document.onwheel = (e) => {
      const disableElements: Element[] = [];
      for (let i = 0; i < overflowElements.length; i++) {
        const e = overflowElements[i];
        const childs = e.querySelectorAll("*");
        disableElements.push(...Array.from(childs));
      }
      if (e.target !== null && !disableElements.includes(e.target as Element)) {
        if (e.deltaY > 0) {
          const pos = nowPid.current + 1;
          wheelDirection.current = 1;
          updateUrl(pids[pos < pids.length ? pos : pids.length - 1]);
        } else if (e.deltaY < 0) {
          const pos = nowPid.current - 1;
          wheelDirection.current = -1;
          updateUrl(pids[pos < 0 ? 0 : pos]);
        }
      } else {
        if (e.deltaY > 0) {
          wheelDirection.current = 1;
        } else if (e.deltaY < 0) {
          wheelDirection.current = -1;
        }
      }
    };

    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchmove", onTouchMove);
  }, []);

  const touchRef = useRef({ x: 0, y: 0, stack: { x: 0, y: 0 } });

  const onTouchStart = (e: TouchEvent) => {
    const touch = touchRef.current;
    touch.x = e.changedTouches[0].pageX;
    touch.y = e.changedTouches[0].pageY;
    touch.stack = { x: 0, y: 0 };
  };

  const onTouchMove = (e: TouchEvent) => {
    const touch = touchRef.current;
    const x = e.changedTouches[0].pageX;
    const y = e.changedTouches[0].pageY;
    const weiX = x - touch.x;
    const weiY = y - touch.y;
    touch.x = x;
    touch.y = y;
    touch.stack.x += weiX;
    touch.stack.y += weiY;
    if (weiX < 0) {
    } else if (weiX > 0) {
    }
    if (
      wheelDirection.current === 0 &&
      (Math.abs(touch.stack.x) > 10 || Math.abs(touch.stack.y) > 10)
    ) {
      const stackWei = Math.abs(touch.stack.x) - Math.abs(touch.stack.y);
      if (stackWei > 0) {
        if (touch.stack.x < 0) {
          const pos = nowPid.current + 1;
          wheelDirection.current = 1;
          updateUrl(pids[pos < pids.length ? pos : pids.length - 1]);
        } else if (touch.stack.x > 0) {
          const pos = nowPid.current - 1;
          wheelDirection.current = -1;
          updateUrl(pids[pos < 0 ? 0 : pos]);
        }
      } else if (stackWei < 0) {
      }
    }
  };

  useEffect(() => {
    if (pid !== undefined) {
      changePage();
    }
  }, [pid !== undefined ? pid[0] : undefined]);

  const changePage = () => {
    const newPid = pid === undefined ? 0 : pids.findIndex((e) => e === pid[0]);
    const wei = newPid === 0 ? 0 : -newPid * 100;
    nowPid.current = newPid;
    if (nameRef.current !== null) {
      const baseElement = nameRef.current.parentElement;
      if (baseElement !== null) {
        const data = { marginLeft: baseElement.style.marginLeft.slice(0, -2) };
        anime({
          targets: data,
          marginLeft: wei,
          easing: "easeOutBack",
          update: () => {
            baseElement.style.marginLeft = `${data.marginLeft}vw`;
          },
        });
      }
    }
  };

  const updateUrl = (toPid: string) => {
    router.push(`/${toPid}`, undefined, { shallow: true });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>MOKA-AYUMU</title>
        <meta name="description" content="MOKA-AYUMU" />
      </Head>

      <div className={styles.main}>
        <Moka nameRef={nameRef} />
        <ChumeWeb />
        <ChumeDebut />
        <HoloP />
        <ERELIZA />
        <BgCanvas wheelDirection={wheelDirection} />
      </div>
      <nav className={styles.nav}>
        {pids.map((v, i) => (
          <div onClick={() => updateUrl(v)} key={i}>
            <div
              className={
                v === (pid !== undefined ? (pid as string[]).join("/") : "")
                  ? "bg-emerald-600"
                  : "bg-slate-600"
              }
            />
            <p className="ml-1">{v}</p>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Home;

export async function getStaticPaths() {
  return {
    paths: [
      ...pids.map((name) => {
        return {
          params: { pid: [name] },
        };
      }),
    ],
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  };
};
