export enum WorldMapAreaBorder {
    NORTH = 1,
    EAST = 2,
    SOUTH = 4,
    WEST = 8,
}

export function opposite(border: WorldMapAreaBorder) {
    switch (border) {
        case WorldMapAreaBorder.NORTH: return WorldMapAreaBorder.SOUTH;
        case WorldMapAreaBorder.SOUTH: return WorldMapAreaBorder.NORTH;
        case WorldMapAreaBorder.WEST: return WorldMapAreaBorder.EAST;
        case WorldMapAreaBorder.EAST: return WorldMapAreaBorder.WEST;
    }
}