import { expose } from 'comlink'

/**
 * This is a very dirty implementation of conway's game of life rules.
 * I am not sure it could be any less efficient.
 * Work should be done to optimise this or find a better algorithm.
 */

type ProcessGridFunction = (cells: [number, number][], gridSize: [number, number], toriodal?: boolean) => [number, number][]

const getTopLeft = (cell: [number, number], cells: [number, number][]) => !!cells.find(c => c[0] === cell[0] - 1 && c[1] === cell[1] - 1)
const getTopRight = (cell: [number, number], cells: [number, number][]) => !!cells.find(c => c[0] === cell[0] + 1 && c[1] === cell[1] - 1)
const getTop = (cell: [number, number], cells: [number, number][]) => !!cells.find(c => c[0] === cell[0] && c[1] === cell[1] - 1)
const getLeft = (cell: [number, number], cells: [number, number][]) => !!cells.find(c => c[0] === cell[0] - 1 && c[1] === cell[1])
const getRight = (cell: [number, number], cells: [number, number][]) => cells.find(c => c[0] === cell[0] + 1 && c[1] === cell[1])
const getBottomLeft = (cell: [number, number], cells: [number, number][]) => !!cells.find(c => c[0] === cell[0] - 1 && c[1] === cell[1] + 1)
const getBottomRight = (cell: [number, number], cells: [number, number][]) => !!cells.find(c => c[0] === cell[0] + 1 && c[1] === cell[1] + 1)
const getBottom = (cell: [number, number], cells: [number, number][]) => !!cells.find(c => c[0] === cell[0] && c[1] === cell[1] + 1)

const neighbours = (cell: [number, number], cells: [number, number][]) =>
  (getTopLeft(cell, cells) ? 1 : 0) +
  (getTopRight(cell, cells) ? 1 : 0) +
  (getTop(cell, cells) ? 1 : 0) +
  (getLeft(cell, cells) ? 1 : 0) +
  (getRight(cell, cells) ? 1 : 0) +
  (getBottomLeft(cell, cells) ? 1 : 0) +
  (getBottomRight(cell, cells) ? 1 : 0) +
  (getBottom(cell, cells) ? 1 : 0)

const processGrid: ProcessGridFunction = (cells, gridSize, toriodal) => {
  const actualCells = [...cells]
  if (toriodal) {
    const topLeft = cells.filter(c => c[0] === 0 && c[1] === 0).map(() => [...gridSize]) as [number, number][]
    const topRight = cells.filter(c => c[0] === gridSize[0] - 1 && c[1] === 0).map(() => [-1, gridSize[1]]) as [number, number][]
    const bottomLeft = cells.filter(c => c[0] === 0 && c[1] === gridSize[1] - 1).map(() => [gridSize[0], -1]) as [number, number][]
    const bottomRight = cells.filter(c => c[0] === gridSize[0] - 1 && c[1] === gridSize[1] - 1).map(() => [-1, -1]) as [number, number][]
    const left = cells.filter(c => c[0] === 0).map(c => [gridSize[0], c[1]]) as [number, number][]
    const right = cells.filter(c => c[0] === gridSize[0] - 1).map(c => [-1, c[1]]) as [number, number][]
    const top = cells.filter(c => c[1] === 0).map(c => [c[0], gridSize[1]]) as [number, number][]
    const bottom = cells.filter(c => c[1] === gridSize[1] - 1).map(c => [c[0], -1]) as [number, number][]
    actualCells.push(
      ...topLeft,
      ...topRight,
      ...bottomLeft,
      ...bottomRight,
      ...left,
      ...right,
      ...top,
      ...bottom
    )
  }
  const newGrid: [number, number][] = []
  for (let x = 0; x < gridSize[0]; x++) {
    for (let y = 0; y < gridSize[1]; y++) {
      const neighbouringCells = neighbours([x, y], actualCells)
      const cellPresent = cells.find(c => c[0] === x && c[1] === y)
      if (cellPresent && !(neighbouringCells < 2 || neighbouringCells > 3)) {
        newGrid.push([x, y])
      } else if (!cellPresent && neighbouringCells === 3) {
        newGrid.push([x, y])
      }
    }
  }
  return newGrid
}

export default processGrid

export type {
  ProcessGridFunction
}

expose(processGrid)
