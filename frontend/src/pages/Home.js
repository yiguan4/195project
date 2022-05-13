import React from "react";
import "./Home.css";

import "animate.css";

import Default from "../components/Default";

function Home() {
  return (
    <Default>
      <div className="bgimg">
        <img src="./backg.jpg" />

        <div className="text1">
          <h1 className="animate__animated animate__backInDown animate__delay-2s">
            Start Looking for your dream car!{" "}
          </h1>
          <div>
            <a href="./Login" className="learn">
              <h2 className="animate__animated animate__backInUp animate__delay-3s">
                Learn More
              </h2>
            </a>
          </div>
        </div>
      </div>
    </Default>
  );
}

export default Home;
