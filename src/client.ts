import { getPreferenceValues } from "@raycast/api";
import AppSeachClient from '@elastic/app-search-node';
import { useEffect, useRef, useState } from "react";

import { Preferences } from './types';
import { mayI } from './helpers'

const { apikey, baseUrl, engineName } = getPreferenceValues() as Preferences




const _engine = {
  current: engineName,
  values: [] as Array<string>
};

export function useEngine () {
  const [engine, setEngine] = useState(_engine)

  useEffect(() => {

    async function fetch (opt = {}) {
      const res = await client.listEngines({ page: { size: 10, current: 1 } })

      function _engineName (r: { name: string}) {
        return r.name
      }
      res.results && (_engine.values = res.results.map(_engineName))
      setEngine({..._engine})
    }

    mayI({ fn: fetch, speaking: ['Engine', 'Fetching'], silence: ['Engine', 'Fetching Failed'] })

  }, [_engine])

  function setCurrentEngine (v: string) {
    _engine.current = v
    setEngine({ ..._engine })
  }

  return { engine, setCurrentEngine }
}

export const client = new AppSeachClient(undefined, apikey, () => `${baseUrl}/api/as/v1/`);

interface StringKeyObject <T> {
  [key: string]: T
}

export interface SearchOption<T> {
  query: string;
  options?: StringKeyObject<T>
}

// todo: defined type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function search(v: SearchOption<any>) {
  return await client.search(_engine.current, v.query, v.options);
};

interface SearchResult {
  title: string
}

export function useSearch(q: string | undefined) {
  const [result, setResult] = useState<SearchResult[]>()

  useEffect(() => {
    if (!q) return

    async function _search() {
      const rs = await search({ query: q as string})
      console.log(rs)
      setResult([...rs.results])
    }
    _search()
  },
    [q]
  )

  return { result }
}

export default client;