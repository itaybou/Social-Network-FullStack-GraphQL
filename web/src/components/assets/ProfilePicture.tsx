import React, { CSSProperties } from "react";

interface ProfilePictureProps {
  image: string | undefined;
  big?: boolean;
  className?: string;
  style?: CSSProperties;
}

function ProfilePicture({
  image,
  className,
  big = true,
  style = undefined,
}: ProfilePictureProps) {
  return style ? (
    <div style={style}>
      {image ? (
        <img
          className={className}
          src={image}
          style={{
            objectFit: "cover",
            verticalAlign: "middle",
            width: big ? "150px" : "40px",
            height: big ? "150px" : "40px",
            borderRadius: "50%",
          }}
          alt="avatar"
        />
      ) : (
        <i
          style={{
            fontSize: big ? "125px" : "30px",
          }}
          className="fa fa-user fa-5x"
          aria-hidden="true"
        ></i>
      )}
    </div>
  ) : (
    <>
      {image ? (
        <img
          className={className}
          src={image}
          style={{
            objectFit: "cover",
            verticalAlign: "middle",
            width: big ? "150px" : "40px",
            height: big ? "150px" : "40px",
            borderRadius: "50%",
          }}
          alt="avatar"
        />
      ) : (
        <i
          style={{
            fontSize: big ? "125px" : "30px",
          }}
          className="fa fa-user fa-5x"
          aria-hidden="true"
        ></i>
      )}
    </>
  );
}

export default ProfilePicture;
