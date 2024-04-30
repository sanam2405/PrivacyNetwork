import { InfoWindowF } from "@react-google-maps/api";

const containerStyle = {
  padding: "20px",
  border: "2px solid #ccc",
  borderRadius: "0.33rem",
  maxWidth: "400px",
  margin: "auto",
};

const rowStyle = {
  fontSize: "1rem",
  marginBottom: "0.33rem",
  fontFamily: "Courier Prime",
};

interface Position {
  lat: number;
  lng: number;
}

export interface Details {
  age: number;
  gender: string;
  college: string;
  name: string;
  email: string;
}

interface DialogBoxProps {
  details: Details;
  position: Position;
  handleCloseDialogBox: () => void;
}

const DetailsDialogBox = ({
  details,
  position,
  handleCloseDialogBox,
}: DialogBoxProps) => {
  return (
    <>
      <InfoWindowF
        position={{
          lat: position.lat,
          lng: position.lng,
        }}
        onCloseClick={() => {
          handleCloseDialogBox();
        }}
      >
        <div style={containerStyle}>
          <h1 style={rowStyle}>Name: {details?.name}</h1>
          <h1 style={rowStyle}>Email: {details?.email}</h1>
          <h1 style={rowStyle}>Age: {details?.age}</h1>
          <h1 style={rowStyle}>Gender: {details?.gender}</h1>
          <h1 style={rowStyle}>College: {details?.college}</h1>
        </div>
      </InfoWindowF>
    </>
  );
};

export default DetailsDialogBox;
