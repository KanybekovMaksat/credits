import React from "react";
import { useNavigate } from "react-router-dom";
import Divider from "@components/Divider";
import { useStore } from "effector-react";
import { $issuedCards } from "@store/issuedCards";
import IssuedCardStatus from "@compv2/IssuedCardStatus";
import "./issuedCards.scss";

const IssuedCards: React.FC = () => {
  const cards = useStore($issuedCards);
  const navigate = useNavigate();

  return cards.length > 0 ? (
    <div className="issued-cards">
      <ul>
        {(cards ?? []).map((el, index) => {
          return (
            <li key={el.id}>
              <div
                className="asset_row"
                onClick={() => navigate(`/cards/${el.id}`)}
              >
                <div className="asset_icon">
                  <img
                    src="/v2/card-bg.svg"
                    style={{ borderRadius: "5px" }}
                    height={32}
                  />
                </div>

                <div
                  className="asset"
                  style={{ alignItems: "start", marginLeft: "45px" }}
                >
                  <span className="asset_ticker">{el.pan}</span>
                  <div>
                    <IssuedCardStatus status={el.status} />
                  </div>
                </div>
                <div className="asset_amount">
                  {el.balance.amount} {el.balance.symbol}
                  <div className="currency_amount">
                    $ {el.balance.fiatBalance.amount}
                  </div>
                </div>
              </div>
              {index !== cards.length - 1 && <Divider className="cs_divider" />}
            </li>
          );
        })}
      </ul>
    </div>
  ) : (
    <></>
  );
};

export default IssuedCards;
