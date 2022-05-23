import { MantineProvider } from "@mantine/core";
import React from "react";
import "./App.css";
import Options from "./components/Options";

export default function App() {
  return (
    <MantineProvider>
      <div className="container">
        <div className="element">
          <Options />
        </div>
      </div>
    </MantineProvider>
  );
}
