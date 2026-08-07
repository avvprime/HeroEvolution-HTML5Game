import { Dir, MaxPieceVal } from "../common";


class BoardModel {

    private _rows: number;
    private _columns: number;

    private _data: Uint8Array;

    constructor(rows: number, columns: number) {
        this._rows = rows;
        this._columns = columns;

        this._data = new Uint8Array(rows * columns);
    }

    public setCell(idx: number, value: number): void {
        this._data[idx] = value;
    }

    public makeMove(dir: number): void {
        const horizontalMove = dir === Dir.Left || dir === Dir.Right;

        const rows = horizontalMove ? this._rows : this._columns;
        const columns = horizontalMove ? this._columns : this._rows;

        let rowStep = 0;
        let colStep = 0;

        let rowIncrement = 1;
        let colIncrement = 1;

        if (dir === Dir.Right) {
            colStep = columns - 1;
            colIncrement = -1;
        }
        if (dir === Dir.Down) {
            rowStep = rows - 1;
            rowIncrement = -1;

            colStep = columns - 1;
            colIncrement = -1;
        }

        let rowCurr = rowStep;
        let colCurr = colStep;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                let idx;
                let stepDist;

                if (horizontalMove) {
                    idx = colCurr + rowCurr * columns;
                    stepDist = colIncrement * -1;
                }
                else {
                    idx = rowCurr + colCurr * rows;
                    stepDist = columns * colIncrement * -1;
                }

                const steps = colStep + colIncrement * (colCurr % columns);

                console.log("idx", idx);
                console.log("steps", steps)
                for (let i = 0; i < steps; i++) {
                    const nextIdx = idx + (i + 1) * stepDist;

                    console.log(nextIdx);
                }
                
                console.log("---");
                
                
                colCurr += colIncrement;
            }

            console.log("********")
            

            rowCurr += rowIncrement;
            colCurr = colStep;
        }
    }

}

export default BoardModel;