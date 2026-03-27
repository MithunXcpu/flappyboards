"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeProps {
  url: string;
  size?: number;
}

export default function QRCode({ url, size = 120 }: QRCodeProps) {
  return (
    <div
      style={{
        padding: 8,
        background: "#ffffff",
        borderRadius: 2,
        display: "inline-flex",
      }}
    >
      <QRCodeSVG
        value={url}
        size={size}
        bgColor="#ffffff"
        fgColor="#000000"
        level="M"
      />
    </div>
  );
}
