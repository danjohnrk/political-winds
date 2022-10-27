export class Arrow {
  constructor(ctx, fromx, fromy, tox, toy, arrowWidth, color) {
    this.fromx = fromx;
    this.fromy = fromy;
    this.tox = tox;
    this.toy = toy;
    this.arrowWidth = arrowWidth;
    this.color = color;
    this.ctx = ctx;

    drawArrow(
      this.ctx,
      this.fromx,
      this.fromy,
      this.tox,
      this.toy,
      this.arrowWidth,
      this.color
    );
    this.update = function (
      stepSize,
      isPositivTrend,
      partyDirection,
      initialState
    ) {
      this.fromx += partyDirection === "left" ? -0.1 : 0.1;
      this.fromy +=
        isPositivTrend === true ? (stepSize / 10) * -1 : stepSize / 10;
      this.tox += partyDirection === "left" ? -0.1 : 0.1;
      this.toy +=
        isPositivTrend === true ? (stepSize / 10) * -1 : stepSize / 10;

      //Die and reoccur when hitting the border
      if (this.tox < 0 || this.toy < 0 || this.tox > 400 || this.toy > 400) {
        this.fromx = initialState.initialFromX;
        this.fromy = initialState.initialFromY;
        this.tox = initialState.initialToX;
        this.toy = initialState.initialToY;
      }
      drawArrow(
        this.ctx,
        this.fromx,
        this.fromy,
        this.tox,
        this.toy,
        this.arrowWidth,
        this.color
      );
    };
  }
}

function drawArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color) {
  //variables to be used when creating the arrow
  var headlen = 2;
  var angle = Math.atan2(toy - fromy, tox - fromx);

  ctx.save();
  ctx.strokeStyle = color;

  //starting path of the arrow from the start square to the end square
  //and drawing the stroke
  ctx.beginPath();
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.lineWidth = arrowWidth;
  ctx.stroke();

  //starting a new path from the head of the arrow to one of the sides of
  //the point
  ctx.beginPath();
  ctx.moveTo(tox, toy);
  ctx.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 10),
    toy - headlen * Math.sin(angle - Math.PI / 10)
  );

  //path from the side point of the arrow, to the other side point
  ctx.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 10),
    toy - headlen * Math.sin(angle + Math.PI / 10)
  );

  //path from the side point back to the tip of the arrow, and then
  //again to the opposite side point
  ctx.lineTo(tox, toy);
  ctx.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 10),
    toy - headlen * Math.sin(angle - Math.PI / 10)
  );

  //draws the paths created above
  ctx.stroke();
  ctx.restore();
}
