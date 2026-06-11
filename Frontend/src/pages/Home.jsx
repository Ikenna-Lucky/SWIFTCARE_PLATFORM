import React from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <main>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </main>
  );
};

export default Home;
