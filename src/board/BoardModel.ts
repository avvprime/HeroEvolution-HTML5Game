import { Dir } from "../common";


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
        const data = this._data;
        const moves: number[] = [];

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

        let moveStartIdx = -1;
        let moveEndIdx = -1;
        let movedVal = 0;

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
                    stepDist = rows * rowIncrement * -1;
                }

                const currentVal = data[idx];
                const steps = colStep + colIncrement * (colCurr % columns);

                moveStartIdx = idx;
                movedVal = currentVal;

                //console.log("idx", idx);
                //console.log("steps", steps)
                
                for (let i = 0; i < steps; i++) {
                    const nextIdx = idx + (i + 1) * stepDist;
                    const nextVal = data[nextIdx];

                    if (nextVal > 0) {
                        if (currentVal !== nextVal) break;

                        // this tile already merged
                        if (moves[moves.length - 2] === nextIdx && moves[moves.length - 1] > 0) break;

                        // values are same
                        data[idx] = 0;
                        data[nextIdx] = currentVal + 1;
                        moves.push(idx, nextIdx, currentVal + 1);
                        
                        moveEndIdx = -1;
                        break;
                    }

                    moveEndIdx = nextIdx;

                    //console.log(nextIdx);
                }

                if (moveEndIdx > -1) {
                    data[moveEndIdx] = movedVal;
                    data[moveStartIdx] = 0;
                    moves.push(moveStartIdx, moveEndIdx, 0);
                    moveEndIdx = -1;
                }
                
                //console.log("---");
                
                
                colCurr += colIncrement;
            }

            //console.log("********")
            

            rowCurr += rowIncrement;
            colCurr = colStep;
        }
    }


    public consoleLog(): void {
        const rows = this._rows;
        const cols = this._columns;
        const data = this._data;

        let output = '';
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const idx = r * cols + c;
                output += data[idx] + ' ';
            }
            output += '\n';
        }

        console.log(output);
    }

}

export default BoardModel;