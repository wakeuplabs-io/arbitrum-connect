//TODO: remove this function, it's the same as truncateEthAddress

export function shortenAddress(add: string) {
    return add.slice(0, 4) + "..." + add.slice(add.length - 4);
  }
  