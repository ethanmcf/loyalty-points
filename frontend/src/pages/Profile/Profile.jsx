import "./Profile.css";
import { useUser } from "../../contexts/UserContext";

import PersonalIfno from "./PersonalIfno";
import UpdateInfo from "./UpdateInfo";

function Profile() {
  const { user } = useUser();
  return (
    <>
      <PersonalIfno />
      <UpdateInfo />
      <div className="content-container">
        <div className="list-container">
          <h2>My transactions</h2>
          {user.promotions.map((promo) => {
            <div>{promo.name}</div>;
          })}
        </div>
      </div>
      <div className="content-container">
        <div className="list-container">
          <h2>My promotions</h2>
          {user.promotions.map((promo) => {
            <div>{promo}</div>;
          })}
        </div>
      </div>
    </>
  );
}

export default Profile;
