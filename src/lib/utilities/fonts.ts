import localFont from "next/font/local";

export const gintoNord = localFont({
  src: [
    {
      path: "../../../public/fonts/ABCGintoDiscordNord-Bold.woff2",
      weight: "700",
      style: "bold",
    },
    {
      path: "../../../public/fonts/ABCGintoDiscordNord-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../../public/fonts/ABCGintoDiscordNord-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-gintoNord",
  display: "swap",
  adjustFontFallback: "Arial",
  preload: true,
});

export const ginto = localFont({
  src: [
    {
      path: "../../../public/fonts/ABCGintoDiscord-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/ABCGintoDiscord-Medium.woff2",
      weight: "500",
      style: "medium",
    },
  ],
  variable: "--font-ginto",
  display: "swap",
  adjustFontFallback: "Arial",
  preload: true,
});

export const ggSans = localFont({
  src: [
    {
      path: "../../../public/fonts/ggsansvf-VF.woff2",
      weight: "400 600",
    },
  ],
  variable: "--font-ggSans",
  display: "swap",
  adjustFontFallback: "Arial",
  preload: true,
});
