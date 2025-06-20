'use client'
import { useState,useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Home from "./home/page";

 let ip='127.0.0.1'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Home></Home>
      </body>
    </html>
  );
}
