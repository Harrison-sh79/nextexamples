"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { IStaticMethods } from "preline/preline";
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

const HSThemeAppearance = {
  init() {
    const defaultTheme = "default";
    let theme = localStorage.getItem("hs_theme") || defaultTheme;

    if (document?.querySelector("html")?.classList.contains("dark")) return;
    this.setAppearance(theme);
  },
  _resetStylesOnLoad() {
    const $resetStyles = document.createElement("style");
    $resetStyles.innerText = `*{transition: unset !important;}`;
    $resetStyles.setAttribute("data-hs-appearance-onload-styles", "");
    document.head.appendChild($resetStyles);
    return $resetStyles;
  },
  setAppearance(theme: any, saveInStore = true, dispatchEvent = true) {
    const $resetStylesEl = this._resetStylesOnLoad();

    if (saveInStore) {
      localStorage.setItem("hs_theme", theme);
    }

    if (theme === "auto") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "default";
    }

    document?.querySelector("html")?.classList.remove("dark");
    document?.querySelector("html")?.classList.remove("default");
    document?.querySelector("html")?.classList.remove("auto");

    document
      ?.querySelector("html")
      ?.classList.add(this.getOriginalAppearance());

    setTimeout(() => {
      $resetStylesEl.remove();
    });

    if (dispatchEvent) {
      window.dispatchEvent(
        new CustomEvent("on-hs-appearance-change", { detail: theme })
      );
    }
  },
  getAppearance() {
    let theme = this.getOriginalAppearance();
    if (theme === "auto") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "default";
    }
    return theme;
  },
  getOriginalAppearance() {
    const defaultTheme = "default";
    return localStorage.getItem("hs_theme") || defaultTheme;
  },
};

export default function PrelineScript() {
  const path = usePathname();

  useEffect(() => {
    import("preline/preline");
    HSThemeAppearance.init();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      window.HSStaticMethods.autoInit();
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (HSThemeAppearance.getOriginalAppearance() === "auto") {
            HSThemeAppearance.setAppearance("auto", false);
          }
        });

      window.addEventListener("load", () => {
        const $clickableThemes = document.querySelectorAll(
          "[data-hs-theme-click-value]"
        );
        const $switchableThemes = document.querySelectorAll(
          "[data-hs-theme-switch]"
        );

        $clickableThemes.forEach(($item) => {
          $item.addEventListener("click", () =>
            HSThemeAppearance.setAppearance(
              $item.getAttribute("data-hs-theme-click-value"),
              true,
              $item as any
            )
          );
        });

        $switchableThemes.forEach(($item: any) => {
          $item.addEventListener("change", (e: any) => {
            HSThemeAppearance.setAppearance(
              e?.target?.checked ? "dark" : "default"
            );
          });

          $item.checked = HSThemeAppearance.getAppearance() === "dark";
        });

        window.addEventListener("on-hs-appearance-change", (e: any) => {
          $switchableThemes.forEach(($item: any) => {
            $item.checked = e?.detail === "dark";
          });
        });
      });
    }, 100);
  }, [path]);

  return null;
}
