import type { NextPage } from "next";
import anime from "animejs";
import { MutableRefObject, useEffect, useRef } from "react";

const BgCanvas: NextPage<{ wheelDirection: MutableRefObject<number> }> = ({
  wheelDirection,
}) => {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const touchData = useRef({ on: false });
  const dataRef = useRef({ x: 0, y: 0, prev: { x: 0, y: 0 } });

  useEffect(() => {
    let data = dataRef.current;
    let circles: {
      start: number;
      anime: anime.AnimeInstance;
      tick: (t: number) => void;
      completed: () => void;
    }[] = [];

    let mouse = {
      start: 0,
      played: false,
      animeUp: baseMouseAnime(-1),
      animeDown: baseMouseAnime(1),
    };

    const circle = (d: Object) => ({
      start: 0,
      anime: baseCircleAnime(
        d,
        anime.random(0, 255),
        anime.random(0, 255),
        anime.random(0, 255)
      ),
      tick: function (t: number) {
        this.anime.tick(t);
        if (t - this.start > this.anime.duration) this.completed();
      },
      completed: () => {},
    });
    onResize();
    window.addEventListener("resize", onResize);

    const render = (t: number) => {
      if (bgCanvasRef.current !== null) {
        const { width, height } = bgCanvasRef.current;

        if (
          mouse.played &&
          (t - mouse.start > mouse.animeUp.duration ||
            t - mouse.start > mouse.animeDown.duration)
        ) {
          mouse.played = false;
          wheelDirection.current = 0;
        }

        const ctx = bgCanvasRef.current.getContext("2d");
        if (ctx !== null) {
          ctx.clearRect(0, 0, width, height);
          if (matchMedia("(pointer:fine)").matches || touchData.current.on) {
            ctx.fillStyle = "#4A8FF7";
            ctx.fillRect(data.x - 13, data.y - 3, 26, 6);
            if (wheelDirection.current === 0) {
              ctx.fillRect(data.x - 3, data.y - 13, 6, 26);
            }
          }

          if (wheelDirection.current !== 0) {
            if (!mouse.played) {
              mouse.played = true;
              mouse.start = t;
            }
            if (wheelDirection.current === 1)
              mouse.animeDown.tick(t - mouse.start);
            else if (wheelDirection.current === -1)
              mouse.animeUp.tick(t - mouse.start);
          }

          if (
            Date.now() % 100 <= 10 &&
            data.prev.x !== data.x &&
            data.prev.y !== data.y
          ) {
            data.prev.x = data.x;
            data.prev.y = data.y;
            let tmp_circle = circle(data);
            tmp_circle.completed = () =>
              circles.splice(circles.indexOf(tmp_circle), 1);
            tmp_circle.start = t;
            circles.push(tmp_circle);
          }
          for (let i = 0; i < circles.length; i++) {
            const e = circles[i];
            e.tick(t);
          }
        }
      }
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    document.onmousemove = (e) => {
      const { pageX, pageY } = e;
      data.x = pageX;
      data.y = pageY;
    };
    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  }, []);

  const baseMouseAnime = (wheel: number) =>
    anime({
      targets: { y: wheel === 1 ? 43 : -23 },
      y: wheel === 1 ? -23 : 43,
      loop: 1,
      direction: "alternate",
      duration: 800,
      autoplay: false,
      update: (e) => {
        const v = (e.animatables[0].target as any).y;
        const ctx = (bgCanvasRef.current as HTMLCanvasElement).getContext(
          "2d"
        ) as CanvasRenderingContext2D;
        const data = dataRef.current;
        ctx.fillStyle = "#F5B2CE";
        ctx.fillRect(data.x - 3, data.y - v, 6, 26);
      },
    });

  const baseCircleAnime = (data: Object, r: number, g: number, b: number) =>
    anime({
      targets: {
        ...data,
        opacity: 1,
        size: anime.random(3, 8),
      },
      x: dataRef.current.x + anime.random(-100, 100),
      y: dataRef.current.y + anime.random(60, 170),
      opacity: 0,
      easing: "easeOutBack",
      duration: 2000,
      update: (e) => {
        const x = (e.animatables[0].target as any).x;
        const y = (e.animatables[0].target as any).y;
        const size = (e.animatables[0].target as any).size;
        const opacity = (e.animatables[0].target as any).opacity;
        const ctx = (bgCanvasRef.current as HTMLCanvasElement).getContext(
          "2d"
        ) as CanvasRenderingContext2D;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.stroke();
      },
    });

  const onTouchStart = (e: TouchEvent) => {
    onTouchMove(e);
    touchData.current.on = true;
  };
  const onTouchMove = (e: TouchEvent) => {
    dataRef.current.x = e.changedTouches[0].pageX;
    dataRef.current.y = e.changedTouches[0].pageY;
  };
  const onTouchEnd = (e: TouchEvent) => {
    onTouchMove(e);
    touchData.current.on = false;
  };

  const onResize = () => {
    if (bgCanvasRef.current !== null) {
      bgCanvasRef.current.width = window.innerWidth;
      bgCanvasRef.current.height = window.innerHeight;
    }
  };

  return (
    <canvas
      className="absolute top-0 pointer-events-none mix-blend-multiply"
      ref={bgCanvasRef}
    />
  );
};

export default BgCanvas;
