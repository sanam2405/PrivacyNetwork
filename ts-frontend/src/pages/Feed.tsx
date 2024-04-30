import { FC } from "react";
import FeedCSS from "../styles/Feed.module.css";
import { Carousal } from "../components/Carousal";

export const Feed: FC = () => {
  return (
    <div className={FeedCSS.container}>
      <Carousal />
      <Carousal />
      <Carousal />
      <Carousal />
      <Carousal />
      <Carousal />
      <Carousal />
      <Carousal />
    </div>
  );
};
