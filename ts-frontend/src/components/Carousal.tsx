import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { CardHeader, CardMedia, CardContent, CardActions } from "@mui/material";
import { Avatar, IconButton, Typography } from "@mui/material";
import { Favorite, MoreVert } from "@mui/icons-material";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import { monthOfTheYear } from "../constants";
import CarousalCSS from "../styles/Carousal.module.css";

const images = ["/sanam.jpg", "rp.jpg"];
const avatarImage = "/rimjhim.svg";

export const Carousal: FC = () => {
  const [click, setClick] = useState(true);
  const navigate = useNavigate();
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = monthOfTheYear[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  const formattedDate = `${month} ${day}, ${year}`;

  const handleClick = () => {
    setClick(!click);
    navigate("/");
  };

  return (
    <div className={CarousalCSS.card}>
      <div className={CarousalCSS.CardContent}>
        <CardHeader
          avatar={<Avatar src={avatarImage} />}
          title="__bokaboka__"
          subheader={formattedDate}
          action={
            <IconButton>
              <MoreVert />
            </IconButton>
          }
        />
        <Swiper
          modules={[Navigation, Pagination, Scrollbar]}
          spaceBetween={0}
          grabCursor
          keyboard={{ enabled: true }}
          navigation
          pagination={{ clickable: true }}
          loop
          breakpoints={{}}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <CardMedia
                component="img"
                className={CarousalCSS.CardMedia}
                image={image}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <CardActions disableSpacing>
        <IconButton>
          <Favorite onClick={handleClick} />
        </IconButton>
        <IconButton>
          <CommentIcon onClick={handleClick} />
        </IconButton>
        <IconButton>
          <ShareIcon onClick={handleClick} />
        </IconButton>
      </CardActions>
      <CardContent>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          className="tiro-bangla-regular"
        >
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi at
          eius in corrupti, quas ullam alias psa odit?
        </Typography>
      </CardContent>
    </div>
  );
};
