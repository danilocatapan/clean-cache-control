//NO IMPLEMENTATIONS HERE
//ONLY INTERFACES, MODELS OR ENTITIES
export interface SavePurchases {
  save: (purchases: Array<SavePurchases.Params>) => Promise<void>
}

export namespace SavePurchases {
  export type Params = {
    id: string
    date: Date
    value: number
  }
}

