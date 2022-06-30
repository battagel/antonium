import { Chips, Chip, Text } from "@mantine/core";
import { useLocalStorageValue } from "@mantine/hooks";

export default function Options() {
  const [value, setValue] = useLocalStorageValue<Array<string>>({
    key: "chip_values",
    defaultValue: [],
  });

  return (
    <div className="options">
      <Text style={{ fontSize: "15px" }}>
        Choose what you want to highlight
      </Text>
      <Chips
        size="xs"
        color="teal"
        multiple
        value={value}
        onChange={setValue}
        style={{ display: "flex" }}
      >
        <Chip value="gen">General</Chip>
        <Chip value="abbr">Abbreviated</Chip>
        <Chip value="short">Shortened</Chip>
        <Chip value="jargon">Jargon</Chip>
      </Chips>
    </div>
  );
}
