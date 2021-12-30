import anime from "animejs";
import type { NextPage } from "next";
import { useEffect, useRef } from "react";
import styles from "./title.module.scss";

const ChumeWeb: NextPage<{ title: string; sub: string; href?: string }> = ({
  title,
  sub,
  href,
}) => {
  const subRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const subData = { left: 4, spacing: 0 };
    const subAnime = {
      start: 0,
      lasttime: 0,
      anime: anime({
        targets: subData,
        // left: 34.5,
        left: 15,
        spacing: [0, 0.5, 0],
        easing: "easeOutSine",
        duration: 500,
        autoplay: false,
        update: () => {
          if (subRef.current !== null) {
            subRef.current.style.left = `${subData.left}%`;
            const children = Array.from(subRef.current.children);
            const halfLen = children.length / 2;
            for (let i = 0; i < children.length; i++) {
              const e = children[i] as HTMLHeadingElement;
              const wei = Math.abs(i - halfLen);
              e.style.letterSpacing = `${
                subData.spacing * (1 - wei / halfLen)
              }rem`;
            }
          }
        },
      }),
    };

    let entered = false;
    let first = false;

    const subMouseEnter = () => {
      entered = true;
      first = true;
    };

    const subMouseLeave = () => {
      entered = false;
      first = true;
    };

    const render = (t: number) => {
      if (first) {
        subAnime.start = t;
        first = false;
        subAnime.lasttime = subAnime.anime.currentTime;
      }
      if (entered) {
        subAnime.anime.tick(t - subAnime.start + subAnime.lasttime);
      } else {
        subAnime.anime.tick(
          subAnime.anime.duration - (t - subAnime.start + subAnime.lasttime)
        );
      }
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    subRef.current?.parentElement?.addEventListener(
      "mouseenter",
      subMouseEnter
    );
    subRef.current?.parentElement?.addEventListener(
      "mouseleave",
      subMouseLeave
    );
  }, []);

  return (
    <div
      className={`group ${styles.name}`}
      onClick={() => (href !== undefined ? window.open(href) : "")}
    >
      <h1>{title}</h1>
      <h2 ref={subRef} className="group-hover:text-teal-600 transition-colors">
        {Array.from(sub).map((v, i) => (
          <span key={i}>{v}</span>
        ))}
        <p className="text-2xl leading-3">→ Click</p>
      </h2>
    </div>
  );
};

export default ChumeWeb;
