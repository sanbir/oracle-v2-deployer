export function fromFeeToBasisPoints(fee: number) {
    return fee === 0 ? Number(process.env.DEFAULT_CLIENT_BASIS_POINTS) : 10000 - fee * 10000
}
