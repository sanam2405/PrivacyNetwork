import { useNavigate } from "react-router-dom";
import { Map } from "./Map";

function Client() {
  const navigate = useNavigate();

  const checker = () => {
    if (localStorage.getItem("user") !== null) {
      return <Map />;
      // eslint-disable-next-line no-else-return
    } else {
      navigate("/auth");
    }
  };

  return <div>{checker()}</div>;
}

export default Client;
