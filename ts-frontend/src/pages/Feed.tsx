import { FC } from "react";
import "../styles/Feed.css";
import { Carousal } from "../components/Carousal";

export const Feed: FC = () => {
  return (
    <div className="container">
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
