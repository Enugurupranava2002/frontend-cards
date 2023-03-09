import { useEffect } from "react";
import { Alignment, Fit, Layout, useRive } from "rive-react";

import "../../dist/css/main.css";

const STATE_MACHINE_NAME = "Login Machine";

const RiveAnimation = (props) => {
  const { rive, RiveComponent } = useRive({
    src: "teddy.riv",
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    props.getRiveInstance(rive);
  }, [rive]);

  return (
    <div className="rive_container">
      <RiveComponent className="rive_container__component" />
    </div>
  );
};

export default RiveAnimation;
