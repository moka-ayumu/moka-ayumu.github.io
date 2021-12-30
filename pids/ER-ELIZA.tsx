import type { NextPage } from "next";
import Head from "next/head";
import homeStyles from "../styles/Home.module.scss";
import prostyles from "./Projects.module.scss";
import Title from "../components/Title";
import { useEffect, useRef } from "react";

const ERELIZA: NextPage = () => {
  return (
    <div className={homeStyles.page}>
      <div className={prostyles.root}>
        <div>
          <Title
            title="PROJECT"
            sub="ER:ELIZA"
            href="https://er-eliza.vercel.app/"
          />
        </div>
        <main className={`overflow-auto ${prostyles.right}`}>
          <div className={`${prostyles.content} flex-col`}>
            <div className="w-2/3 h-full flex flex-none">
              <img
                src="https://github.com/moka-ayumu/er-eliza/raw/5cdbd0391559becf7af1d1e4eb8cf7d5f7deeb95/readme_files/er-eliza.gif"
                className="m-auto h-full rounded-xl object-contain shadow-2xl"
              />
            </div>
            <div className="overflow-auto w-11/12">
              <h1>Description</h1>
              <p>Eternal Return Game Stat & Tool Site</p>
              <h1>Technology Stack</h1>
              <p>Next.js(SSR, Incremental Static Generation)</p>
              <h1>Function (To Do)</h1>
              <p>
                <input type="checkbox" readOnly checked={false} />
                Image
                <br />
                <input type="checkbox" readOnly checked={false} />
                Font
                <br />
                <input type="checkbox" readOnly checked />
                User Stat Page
                <br />
                <input type="checkbox" readOnly checked={false} />
                Enhanced User Stat Page
                <br />
                <input type="checkbox" readOnly checked />
                Game Stat Page
                <br />
                <input type="checkbox" readOnly checked={false} />
                Enhanced Game Stat Page
                <br />
                <input type="checkbox" readOnly checked={false} />
                Game Route Page
                <br />
                <input type="checkbox" readOnly checked={false} />
                Game Route Generator
                <br />
                <input type="checkbox" readOnly checked={false} />
                i18n
                <br />
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ERELIZA;
