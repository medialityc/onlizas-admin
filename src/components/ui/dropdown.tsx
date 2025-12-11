"use client";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import React from "react";
import type { CSSProperties } from "react";

const Dropdown = (props: any, forwardedRef: any) => {
  const [visibility, setVisibility] = useState<any>(false);

  const referenceRef = useRef<any>(null);
  const popperRef = useRef<any>(null);

  const [popperStyle, setPopperStyle] = useState<CSSProperties>({});

  const computePosition = () => {
    const refEl = referenceRef.current as HTMLElement | null;
    const popEl = popperRef.current as HTMLElement | null;
    if (!refEl || !popEl) return;

    const rect = refEl.getBoundingClientRect();
    const placement = props.placement || "left-start";
    const offset = props.offset || [0, 8]; // [x, y]

    let top = 0;
    let left = 0;

    switch (placement) {
      case "bottom-start":
        top = rect.bottom + offset[1];
        left = rect.left + offset[0];
        break;
      case "bottom-end":
        top = rect.bottom + offset[1];
        left = rect.right - popEl.offsetWidth - offset[0];
        break;
      case "top-start":
        top = rect.top - popEl.offsetHeight - offset[1];
        left = rect.left + offset[0];
        break;
      case "top-end":
        top = rect.top - popEl.offsetHeight - offset[1];
        left = rect.right - popEl.offsetWidth - offset[0];
        break;
      case "right-start":
        top = rect.top + offset[1];
        left = rect.right + offset[0];
        break;
      case "right-end":
        top = rect.bottom - popEl.offsetHeight - offset[1];
        left = rect.right + offset[0];
        break;
      case "left-end":
        top = rect.bottom - popEl.offsetHeight - offset[1];
        left = rect.left - popEl.offsetWidth - offset[0];
        break;
      case "left-start":
      default:
        top = rect.top + offset[1];
        left = rect.left - popEl.offsetWidth - offset[0];
        break;
    }

    setPopperStyle({ position: "fixed", top, left });
  };

  const handleDocumentClick = (event: any) => {
    if (
      referenceRef.current.contains(event.target) ||
      popperRef.current.contains(event.target)
    ) {
      return;
    }

    setVisibility(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    if (visibility) {
      // compute on open
      computePosition();
    }
  }, [visibility]);

  useEffect(() => {
    const onResize = () => {
      if (visibility) computePosition();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [visibility]);

  useImperativeHandle(forwardedRef, () => ({
    close() {
      setVisibility(false);
    },
  }));

  return (
    <>
      <button
        ref={referenceRef}
        type="button"
        className={props.btnClassName}
        onClick={() => setVisibility(!visibility)}
      >
        {props.button}
      </button>

      <div
        ref={popperRef}
        style={popperStyle}
        className="z-9999"
        onClick={() => setVisibility(!visibility)}
      >
        {visibility && props.children}
      </div>
    </>
  );
};

export default forwardRef(Dropdown);
