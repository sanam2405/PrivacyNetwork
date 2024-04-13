import { CSSProperties } from "react";
import { Radio } from "react-loader-spinner";

const Loader = () => {
  const LoaderStyle: CSSProperties = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  };

  return (
    <>
      <div style={LoaderStyle}>
        <Radio
          visible={true}
          height="200"
          width="200"
          ariaLabel="radio-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    </>
  );
};

export default Loader;
