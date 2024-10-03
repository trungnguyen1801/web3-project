export const formatAddress = (address: string) => {
  if (address?.length !== 42) {
    return
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
