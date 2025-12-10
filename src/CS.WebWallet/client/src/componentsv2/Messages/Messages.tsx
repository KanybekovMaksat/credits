import React from "react";
import { useStore } from "effector-react";
import { $messages } from "@store/displayableMessages";
import "./messages.scss";
import { $translation } from "@store/translation";
import { DisplayableMessageRow } from "@services/DisplayableMessagesService";

export interface MessagesProps {
  messageTags?: string[];
}

const Messages: React.FC<MessagesProps> = ({ messageTags }) => {
  const { messages } = useStore($messages);
  const { currentLanguage } = useStore($translation);

  const tags = React.useMemo(() => {
    if (!messageTags || messageTags.length === 0) return [];
    return (messages ?? []).reduce(
      (acc: DisplayableMessageRow[], cur: DisplayableMessageRow) => {
        if (messageTags.find((e) => e === cur.tag)) acc.push(cur);
        return acc;
      },
      []
    );
  }, [messageTags, currentLanguage]);

  return (
    <>
      {(tags ?? []).map((e, i) => (
        <div key={i} className="message-row ">
          {e.text}
        </div>
      ))}
      {(tags ?? []).length > 0 && <br />}
    </>
  );
};

export default Messages;
