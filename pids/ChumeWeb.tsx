import type { NextPage } from "next";
import Head from "next/head";
import homeStyles from "../styles/Home.module.scss";
import prostyles from "./Projects.module.scss";
import Title from "../components/Title";
import { useEffect, useRef } from "react";

const ChumeWeb: NextPage = () => {
  return (
    <div className={homeStyles.page}>
      <div className={prostyles.root}>
        <div>
          <Title title="PROJECT" sub="CHUME WEB" href="https://chume.moe/" />
        </div>
        <main className={`overflow-auto ${prostyles.right}`}>
          <div className={prostyles.content}>
            <div className="w-96 h-full flex flex-col flex-none">
              <img
                src="/projects/chume_web/logo.png"
                className="m-auto h-1/6 rounded-t-xl object-cover shadow-2xl"
              />
              <img
                src="/projects/chume_web/detail.gif"
                className="m-auto h-full rounded-xl object-cover shadow-2xl"
              />
            </div>
            <div className="overflow-auto">
              <h1>Description</h1>
              <p>
                Self-introduction site based on 'Next.js' of virtual streamer
                'Chume'
              </p>
              <h1>Function (To Do)</h1>
              <p>
                <input type="checkbox" readOnly checked />
                'CHUME' text cascading animation
                <br />
                <input type="checkbox" readOnly checked />
                Each title and description
                <br />
                <input type="checkbox" readOnly checked />
                Add minigame like '2048'
                <br />
                <input type="checkbox" readOnly checked={false} />
                i18n
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChumeWeb;
