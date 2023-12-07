import "../styles/UserBanner.css";

const UserBanner = ({ username, name, dp_link }) => {
  return (
    <>
      <div className="user-banner-container">
        <div className="profile-photo-container">
          <img
            className="user-profile-img"
            // onClick={changeProfile}
            src={dp_link}
            alt="User Profile Photo"
          />
        </div>
        <div className="user-details-container">
          <div className="user-full-name">
            <h1>{name}</h1>
          </div>
          <div className="user-username">
            <h3>@{username}</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBanner;
