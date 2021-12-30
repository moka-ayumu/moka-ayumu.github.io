import type { NextPage } from "next";
import Head from "next/head";
import homeStyles from "../styles/Home.module.scss";
import prostyles from "./Projects.module.scss";
import Title from "../components/Title";
import { useEffect, useRef } from "react";

const ChumeDebut: NextPage = () => {
  return (
    <div className={homeStyles.page}>
      <div className={prostyles.root}>
        <div>
          <Title
            title="PROJECT"
            sub="Chume Debut"
            href="https://moka-ayumu.github.io/chume_debut/main"
          />
        </div>
        <main className={`overflow-auto ${prostyles.right}`}>
          <div className={`${prostyles.content} flex-col`}>
            <div className="w-2/3 h-full flex flex-none">
              <img
                src="https://github.com/moka-ayumu/chume_debut/raw/35309f8cbd78f08f9d9fc2683e85a2db6a9ea8ff/public/logo.png"
                className="w-20 m-auto h-1/6 rounded-t-xl object-contain shadow-2xl"
              />
              <img
                src="https://github.com/moka-ayumu/chume_debut/raw/35309f8cbd78f08f9d9fc2683e85a2db6a9ea8ff/readme_files/chume_debut.gif"
                className="m-auto h-full rounded-xl object-contain shadow-2xl"
              />
            </div>
            <div className="overflow-auto w-11/12">
              <h1>Description</h1>
              <p>Debut site based on 'Next.js' of virtual streamer 'Chume'</p>
              <h1>Technology Stack</h1>
              <p>React</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChumeDebut;
