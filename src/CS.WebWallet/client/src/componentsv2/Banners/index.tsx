import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Banner } from "@services/ReferenceService";
import { useUnit } from "effector-react";
import { $banners } from "@store/banners";

import "./banners.scss";

const BannerItem: React.FC<{ banner: Banner }> = ({ banner }) => {
  const { t } = useTranslation();
  const background = !banner.colorTwo
    ? banner.colorOne
    : `linear-gradient(42deg, ${banner.colorOne} 0%, ${banner.colorTwo} 43%)`;

  return (
    <Link
      to={banner.link}
      target={
        !!banner.link
          ? banner.link.startsWith("http")
            ? "_blank"
            : "_self"
          : "_top"
      }
      style={{ textDecoration: "none" }}
    >
      <div
        className="banner-item"
        style={{
          background: background,
          backgroundImage: `url(${banner.imageUrl})`,
        }}
      >
        {!banner.imageUrl && (
          <>
            <div className="banner-image">
              {banner.icon && <img src={banner.icon} />}
            </div>
            <div className="banner-texts">
              <div className="banner-title" style={{ color: banner.textColor }}>
                {t(banner.title)}
              </div>
              <div
                className="banner-subTitle"
                style={{ color: banner.textColor }}
              >
                {t(banner.subTitle)}
              </div>
              {banner.text && (
                <div
                  className="banner-text"
                  style={{ color: banner.textColor }}
                >
                  {t(banner.text)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Link>
  );
};

const BannerAnchor: React.FC<{ placement: number; anchor: string }> = ({
  placement,
  anchor,
}) => {
  const { banners } = useUnit($banners);

  const myBanners = (banners ?? []).filter(
    (e) => e.placement === placement && e.anchors.find((a) => a === anchor)
  );

  if (myBanners.length === 0) return <></>;

  return (
    <div className="banners-anchor">
      <Swiper
        style={{ maxWidth: "620px" }}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 7000,
          disableOnInteraction: true,
        }}
        modules={[Autoplay]}
      >
        {myBanners.map((e) => (
          <SwiperSlide key={e.id} style={{ width: "500px" }}>
            <BannerItem banner={e} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerAnchor;
