import { Chips, Chip, Text } from "@mantine/core";

export default function Options() {
  return (
    <div className="options">
      <Text style={{ fontSize: "15px" }}>
        Choose what you want to highlight
      </Text>
      <Chips size="xs" color="teal" multiple style={{ display: "flex" }}>
        <Chip value="gen">General</Chip>
        <Chip value="abbr">Abbreviated</Chip>
        <Chip value="short">Shortened</Chip>
        <Chip value="jargon">Jargon</Chip>
      </Chips>
    </div>
  );
}
