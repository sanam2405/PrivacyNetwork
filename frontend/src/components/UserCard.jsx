import "../styles/UserCard.css";

const UserCard = ({username, name, dp_link}) => {
  return (
    <>
      <div className="container">
        <div className="card_item">
          <div className="card_inner">
            <img src={dp_link} alt="" />
            <div className="Name">{name}</div>
            <div className="userName">{username}</div>
            <div className="userUrl"></div>
            <div className="detail-box">
              <div className="gitDetail">
                <span>College</span>JU
              </div>
              <div className="gitDetail">
                <span>Following</span>45
              </div>
              <div className="gitDetail">
                <span>Followers</span>11
              </div>
            </div>
            <button className="addFriend">Add Friend</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;
