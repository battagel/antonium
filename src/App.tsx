import {
  AppShell,
  Button,
  Center,
  List,
  MantineProvider,
  Modal,
  Popover,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import Options from "./components/Options";

export default function App() {
  const theme = useMantineTheme();
  const [helpOpened, setHelpOpened] = useState<boolean>(false);

  return (
    <MantineProvider
      theme={{
        colorScheme: "light",
      }}
    >
      <AppShell
        padding="md"
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
        sx={{ width: "100%", height: "100%" }}
      >
        <Center>
          <div
            style={{
              backgroundColor: "#00B388",
              padding: "10px",
              width: "100%",
            }}
          >
            <div
              style={{ backgroundColor: theme.colors.gray[0], padding: "10px" }}
            >
              <div style={{ display: "flex", marginBottom: "5px" }}>
                <Title order={1}>Antonium</Title>
                <Button
                  radius="xl"
                  size="xs"
                  color="teal"
                  compact
                  style={{ marginLeft: "auto", order: 2 }}
                  onClick={() => setHelpOpened((o) => !o)}
                >
                  ?
                </Button>
                <Modal
                  opened={helpOpened}
                  onClose={() => setHelpOpened(false)}
                  title="Help - Please Scroll Down"
                  style={{}}
                >
                  <div style={{ display: "block" }}>
                    <Text>
                      Thanks for downloading Antonium! Here is some helpful
                      info:
                    </Text>
                    <List>
                      <List.Item>
                        General - Apply definition to general terms
                      </List.Item>
                      <List.Item>
                        Abbreviations - Reveal the possbile meanings behind
                        abbreviated words
                      </List.Item>
                      <List.Item>Shorteded - Extend shorted words</List.Item>
                      <List.Item>Jargon - Summerise technical terms</List.Item>
                    </List>
                  </div>
                </Modal>
              </div>
              <Options />
            </div>
          </div>
        </Center>
      </AppShell>
    </MantineProvider>
  );
}
