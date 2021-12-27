import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
const Index: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/moka");
  }, []);
  return <></>;
};

export default Index;
