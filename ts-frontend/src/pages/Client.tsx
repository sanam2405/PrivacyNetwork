import { useEffect } from "react";
import { Map } from "./Map";
import { useNavigate } from "react-router-dom";

function Client() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user") || localStorage.getItem("jwt")) {
    } else {
      navigate("/auth");
    }
  }, []);

  const checker = () => {
    if (localStorage.getItem("user") !== null) {
      return <Map />;
      // eslint-disable-next-line no-else-return
    }
  };

  return <div>{checker()}</div>;
}

export default Client;
