import { useEffect, useState } from "react";

function Resize() {
  const ref = useRef(null);
  const refLeft = useRef(null);

  useEffect(() => {
    const resizebleEle = ref.current; // 現在的值
    const styles = window.getComputedStyle(resizebleEle); // returns a CSSStyleDeclaration object.
    let width = parseInt(styles.width, 10);
    let height = parseInt(styles.height, 10);
    let x = 0;
    let y = 0;
  }, []);

  resizebleEle.tyle.left = "50px";

  const onMousMoveRightResize = (event) => {
    const dx = event.client - x;
    x = event.clientX;
    width = width + dx;
    resizebleEle.style.width = `${width}px`;
  };

  return <div>Resize</div>;
}

export default Resize;
