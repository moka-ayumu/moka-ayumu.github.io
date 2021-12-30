import type { NextPage } from "next";
import Head from "next/head";
import homeStyles from "../styles/Home.module.scss";
import prostyles from "./Projects.module.scss";
import Title from "../components/Title";
import { useEffect, useRef } from "react";

const HoloP: NextPage = () => {
  return (
    <div className={homeStyles.page}>
      <div className={prostyles.root}>
        <div>
          <Title
            title="PROJECT"
            sub="HoloP"
            href="https://github.com/moka-ayumu/HoloP/releases"
          />
        </div>
        <main className={`overflow-auto ${prostyles.right}`}>
          <div className={`${prostyles.content} flex-col`}>
            <div className="w-2/3 h-full flex flex-none">
              <img
                src="https://github.com/moka-ayumu/HoloP/raw/a008432aa848dffcf20bed8d2391a6b2c689fe36/static/holoP.png"
                className="w-20 m-auto h-1/6 rounded-t-xl object-contain shadow-2xl"
              />
              <img
                src="https://github.com/moka-ayumu/HoloP/raw/a008432aa848dffcf20bed8d2391a6b2c689fe36/readme_files/preview.gif"
                className="m-auto h-full rounded-xl object-contain shadow-2xl"
              />
            </div>
            <div className="overflow-auto w-11/12">
              <h1>Description</h1>
              <p>VTuber Songs Player etc...</p>
              <h1>Technology Stack</h1>
              <p>Typescript, Electron, React, Redux</p>
              <h1>Function (To Do)</h1>
              <p>
                <input type="checkbox" readOnly checked />
                Import datas from Holodex API
                <br />
                <input type="checkbox" readOnly checked />
                Player
                <br />
                <input type="checkbox" readOnly checked />
                Playlist
                <br />
                <input type="checkbox" readOnly checked={false} />
                Playlist save & edit ...
                <br />
                <input type="checkbox" readOnly checked={false} />
                Lyrics
                <br />
                <input type="checkbox" readOnly checked={false} />
                Link with Windows (NodeRT)
                <br />
                <input type="checkbox" readOnly checked={false} />
                etc
                <br />
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HoloP;
