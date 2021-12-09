import { ActionPanel, CopyToClipboardAction, Icon, List } from "@raycast/api";
import { useState } from 'react'
import { useEngine, useSearch } from "../client";

export function SearchList(): JSX.Element {
  const [searchText, setSearchText] = useState<string>();

  const { result } = useSearch(searchText)

  return (
    <List searchBarPlaceholder="Filter by title..." onSearchTextChange={setSearchText}>
      {
        result?.map(r => (
          <SearchItem item={r}/>
        ))
      }
    </List>
  );
}

function SearchItem(props: { item: any }): JSX.Element {
  const item = props.item;
  console.log(item.title.raw)
  return (<List.Item title={item.title.raw} actions={<SearchItemActionPanel item={item}/>}/>);
}

function SearchItemActionPanel(props: { item: any }): JSX.Element {
  const item = props.item;
  const { engine, setCurrentEngine } = useEngine()

  return (
    <ActionPanel>
      <ActionPanel.Section title="Action">
        <CopyToClipboardAction content={item.title} />
      </ActionPanel.Section>
      <ActionPanel.Section title="Engines">
        {
          engine.values.map((e, i) => (
            <ActionPanel.Item title={e} onAction={() => setCurrentEngine(e)} key={i}/>
          ))
        }
      </ActionPanel.Section>
    </ActionPanel>
  );
}