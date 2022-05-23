import React from "react";
import { Chips, Chip } from "@mantine/core";

export default function Options() {
  return (
    <Chips multiple>
      <Chip value="abbr">Abbreviations</Chip>
      <Chip value="jargon">Jargon</Chip>
    </Chips>
  );
}
