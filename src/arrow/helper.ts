
interface IParty {
    name: string;
    color: string;
    vote1: number;
    vote2: number;
    direction: "left" | "right";
}

interface IArrowData {
    partyName: string;
    amountOfArrows: number;
    baseArrow: { fromX: number; fromY: number; toX: number; toY: number; arrowWidth: number; color: string; };
    stepSize: number;
    isPositivTrend: boolean;
    partyDirection: "left" | "right";
    initialState: { initialFromX: number; initialFromY: number; initialToX: number; initialToY: number; };
}

const ARROW_LENGTH = 10;
const ARROW_WIDTH = 1;

function getRandomArbitrary({ min, max }: { min: number, max: number }): number {
    return Math.random() * (max - min) + min;
}

export function createArrowDataList({ parties }: { parties: IParty[] }) {
    const arrowList: IArrowData[] = [];

    parties.forEach((party) => {
        const amountOfArrowsForThisParty = Math.round(party.vote2 * 10)
        const arrows = createPartyArrows({ party: party, amount: amountOfArrowsForThisParty });
        arrows.forEach((arrow) => {
            arrowList.push(arrow);
        })
    })

    return arrowList;
}


function createPartyArrows({ party, amount }: { party: IParty, amount: Number }) {
    const arrowList = [];
    let i = 0;


    while (amount > i) {
        i++;
        const voteMargin = ((party.vote2 - party.vote1) / party.vote1) >= 1 ? 1 : ((party.vote2 - party.vote1) / party.vote1);

        const isPositivTrend = voteMargin >= 0;

        let startingPoint = [0, 0];

        //Creates a random position in respect of a partys direction and trend
        /**[ ][ ]
        *  [x][ ] 
        */
        if (party.direction === 'left' && isPositivTrend === true) {
            const startingX = getRandomArbitrary({ min: 0, max: 200 });
            const startingy = getRandomArbitrary({ min: 0, max: 200 });
            startingPoint = [startingX, startingy];
        }
        /**[ ][x]
         * [ ][ ] 
         */
        if (party.direction === 'right' && isPositivTrend === true) {
            const startingX = getRandomArbitrary({ min: 200, max: 400 });
            const startingy = getRandomArbitrary({ min: 0, max: 200 });
            startingPoint = [startingX, startingy];
        }
        /**[ ][ ]
         * [x][ ] 
         */
        if (party.direction === 'left' && isPositivTrend === false) {
            const startingX = getRandomArbitrary({ min: 0, max: 200 });
            const startingy = getRandomArbitrary({ min: 200, max: 400 });
            startingPoint = [startingX, startingy];
        }
        /**[ ][ ]
         * [ ][x] 
         */
        if (party.direction === 'right' && isPositivTrend === false) {
            const startingX = getRandomArbitrary({ min: 200, max: 400 });
            const startingy = getRandomArbitrary({ min: 200, max: 400 });
            startingPoint = [startingX, startingy];
        }

        const alphaAngleDegree = 90 * Math.abs(voteMargin);
        //The reason we cap it at 15 and not zero is the visual speed when a party has a very high vote margin (0 no speed 1 very fast)
        const betaAgnleDegree = 90 - alphaAngleDegree === 0 ? 15 : 90 - alphaAngleDegree;
        const aplhaAngleRadians = alphaAngleDegree * (Math.PI / 180);
        const betaAgnleRadians = betaAgnleDegree * (Math.PI / 180);



        const xAxisLength = ARROW_LENGTH * Math.sin(betaAgnleRadians)
        const yAxisLenght = ARROW_LENGTH * Math.sin(aplhaAngleRadians)

        const fromX = startingPoint[0];
        const fromY = startingPoint[1];

        const toX = party.direction === 'left' ? startingPoint[0] + (xAxisLength * (-1)) : startingPoint[0] + xAxisLength;
        const toY = isPositivTrend === true ? startingPoint[1] - yAxisLenght : startingPoint[1] + yAxisLenght;

        arrowList.push({
            partyName: party.name,
            amountOfArrows: (party.vote2 / 100) * 1000,
            baseArrow: { fromX: fromX, fromY: fromY, toX: toX, toY: toY, arrowWidth: ARROW_WIDTH, color: party.color },
            stepSize: yAxisLenght / xAxisLength,
            isPositivTrend: isPositivTrend,
            partyDirection: party.direction,
            initialState: { initialFromX: fromX, initialFromY: fromY, initialToX: toX, initialToY: toY }
        })
    }
    return arrowList;

}