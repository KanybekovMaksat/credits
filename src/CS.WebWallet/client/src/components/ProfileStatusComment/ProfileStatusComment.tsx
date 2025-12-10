import React from "react";
import "./styles.scss";

const ProfileStatusComment: React.FC<{ comment?: string | null }> = (props) => {
  const { comment } = props;

  return comment !== null && comment !== "" ? (
    <div className="stage-comment">
      <span className="comment">{comment}</span>
    </div>
  ) : (
    <></>
  );
};

export default ProfileStatusComment;
