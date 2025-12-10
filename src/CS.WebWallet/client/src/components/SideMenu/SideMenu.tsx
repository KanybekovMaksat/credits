import React, { useMemo } from "react";
import "./sideMenu.scss";
import "./sideMenu.mobile.scss";
import MenuItem from "./components/MenuItem";

import CreditsLogoIcon from "@components/Icons/CreditsLogoIcon";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  WalletIcon,
  BitcoinIcon,
  CircleDiagramIcon,
  ChartIcon,
  CircleClockIcon,
} from "./components/SideMenuIcons";
import { useStore } from "effector-react";
import { $sideMenu, menuChanged } from "@components/SideMenu/sideMenu.store";
import MenuIcon from "@components/Icons/MenuIcon";
import GrayRoundCrossIcon from "@components/Icons/GrayRoundCrossIcon";
import { $translation } from "@store/translation";
import { $showcase } from "@store/showcase";
import { $accounts } from "@store/accounts";
import MenuStaking from "@compv2/Icons/MenuStaking";

const SideMenu = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useStore($translation);
  const { open, showWallet } = useStore($sideMenu);
  const { deposits } = useStore($showcase);
  const { all } = useStore($accounts);

  const items = useMemo(() => {
    return (
      <ul>
        {showWallet && (
          <MenuItem
            title={t("menu.wallet")}
            link="/wallet"
            icon={<WalletIcon />}
          />
        )}
        <MenuItem
          title={t("menu.crypto")}
          link="/accounts"
          icon={<BitcoinIcon />}
        />
        {(deposits?.length > 0 || all.find((e) => e.type === 80)) && (
          <MenuItem
            title={t("menu.staking")}
            link="/staking"
            icon={
              <span style={{ marginLeft: "-5px" }}>
                <MenuStaking />
              </span>
            }
          />
        )}

        <MenuItem
          title={t("menu.payments")}
          link="/transfer"
          icon={<CircleDiagramIcon />}
        >
          <MenuItem sub title={t("menu.topUp")} link="/topup" />
          <MenuItem sub title={t("menu.transfer")} link="/transfer" />
          <MenuItem sub title={t("menu.withdraw")} link="/withdraw" />
        </MenuItem>
        <MenuItem
          title={t("menu.exchange")}
          link={`/exchange`}
          icon={<ChartIcon />}
        />
        <MenuItem
          title={t("menu.history")}
          link="/all-history"
          icon={<CircleClockIcon />}
        />
      </ul>
    );
  }, [showWallet, open, currentLanguage]);

  return (
    <>
      <aside className={`side_menu_mobile ${open ? "open" : "close"}`}>
        {open === false && (
          <button className="menu_button" onClick={() => menuChanged()}>
            <MenuIcon />
          </button>
        )}
        {open && (
          <div className="menu_wrapper">
            <button className="menu_close_button" onClick={() => menuChanged()}>
              <GrayRoundCrossIcon />
            </button>
            <div className="mobile_logo">
              <CreditsLogoIcon />
            </div>
            <div className="items_wrapper">{items}</div>
          </div>
        )}
      </aside>
      <aside className="side_menu">
        <Link to={"/accounts"}>
          <button type="button" className="logo">
            <CreditsLogoIcon />
          </button>
        </Link>
        <div className="menu_wrapper">{items}</div>
      </aside>
    </>
  );
};

export default SideMenu;
