import { Chips, Chip, Text } from "@mantine/core";
import { useRef, useEffect, useState } from "react";

export default function Options() {
    const [value, setValue] = useState<Array<string>>([]);
    const isInitialMount = useRef(0);

    useEffect(() => {
        chrome.storage.sync.get(["option_types"], function (result) {
            setValue(result["option_types"])
        })
    }, [])
    useEffect(() => {
        // Store data whenever value changes
        if (isInitialMount.current < 3) {
            // This is odd but allow it. There are 3 changes to this variable before the loading is complete so only sense changes after these
            console.log("Not reloading")
            isInitialMount.current += 1
            console.log(isInitialMount)
        }
        else {
            console.log("reloading")
            chrome.storage.sync.set({ option_types: value }, function () {
                console.log("Data stored of value " + value);
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
                    chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
                });
            });
        }
    }, [value]);

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
                <Chip disabled value="short">Shortened</Chip>
                <Chip disabled value="jargon">Jargon</Chip>
            </Chips>
        </div>
    );
}
