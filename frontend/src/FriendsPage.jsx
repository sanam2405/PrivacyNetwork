import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
require("dotenv").config();
const PORT = process.env.PORT || 5050;
const BASE_API_URI = `http://localhost:${PORT}`;

const FriendsPage = () => {

    const defaultPicLink = 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png';
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [users, setUsers] = useState([]);
    const [changePic, setChangePic] = useState(false);

    useEffect(() => {
        fetch(`${BASE_API_URI}/api/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setUser(data.user);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        fetch(`${BASE_API_URI}/api/allusers`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setUsers(data.users);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const changeProfile = () => {
        setChangePic(!changePic);
    }

    const checker = () => {
        if (localStorage.getItem("user")) {
            return (<>
                <h1>{user.username}</h1>
                <h1>{user.name}</h1>
                <img
                    className="imgg"
                    onClick={changeProfile}
                    src={user.Photo ? user.Photo : defaultPicLink}
                    alt="pic"
                />
                <div>
                    {users.length && users.map((item) => {
                        return (
                            <>
                                <h3>{item.name}</h3>
                                <h3>{item.username}</h3>
                                <img
                                    className="imgg"
                                    onClick={changeProfile}
                                    src={item.Photo ? item.Photo : defaultPicLink}
                                    alt="pic"
                                />
                            </>
                        );
                    })}
                </div>
            </>);
        }
        else {
            navigate("/");
        }
    }

    return (<>
        {checker()}
    </>);
}

export default FriendsPage;