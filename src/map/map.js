import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";
import { Arrow } from "../arrow/Arrow";
import nordland from "../data/nordland.json";
import partyListLeft from "../data/leftParties.json";
import partyListRight from "../data/rightParties.json";
import { createArrowDataList } from "../arrow/helper";

export default function Map() {
  const mapContainer = useRef(null);

  const leftCanvasContainer = useRef(null);

  const rightCanvasContainer = useRef(null);

  const map = useRef(null);
  const [lng] = useState(14.362);
  const [lat] = useState(67.269);
  const [zoom] = useState(5);
  const [API_KEY] = useState("get_your_own_OpIi9ZULNHzrESv6T2vL");

  useEffect(() => {
    var leftCanvas = leftCanvasContainer.current;
    var leftContext = leftCanvas.getContext("2d");

    var rightCanvas = rightCanvasContainer.current;
    var rightContext = rightCanvas.getContext("2d");

    if (map.current) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", function () {
      animateLeftCanvas(leftContext);
      animateRightCanvas(rightContext);
      addRightCanvasToMap(map.current);
      addLeftCanvasToMap(map.current);
      addGeoJSONLineToMap(map.current);
    });
    map.current.on("click", function (event) {
      console.log(event.lngLat);
    });
  });

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
      <canvas
        ref={leftCanvasContainer}
        id="leftCanvasID"
        width="400"
        height="400"
      >
        Canvas not supported
      </canvas>
      <canvas
        ref={rightCanvasContainer}
        id="rightCanvasID"
        width="400"
        height="400"
      >
        Canvas not supported
      </canvas>
    </div>
  );
}

function animateLeftCanvas(leftContext) {
  const arrowList = createArrowDataList({ parties: partyListRight.parties });

  const arrowsToAnimate = arrowList.map((arrow) => {
    return {
      baseArrow: new Arrow(
        leftContext,
        arrow.baseArrow.fromX,
        arrow.baseArrow.fromY,
        arrow.baseArrow.toX,
        arrow.baseArrow.toY,
        arrow.baseArrow.arrowWidth,
        arrow.baseArrow.color
      ),
      stepSize: arrow.stepSize,
      isPositivTrend: arrow.isPositivTrend,
      partyDirection: arrow.partyDirection,
      initialState: arrow.initialState,
    };
  });
  function animate() {
    requestAnimationFrame(animate);
    leftContext.clearRect(0, 0, 400, 400);
    arrowsToAnimate.forEach((arrow) => {
      arrow.baseArrow.update(
        arrow.stepSize,
        arrow.isPositivTrend,
        arrow.partyDirection,
        arrow.initialState
      );
    });
  }

  animate();
}

function animateRightCanvas(rightContext) {
  const arrowList = createArrowDataList({ parties: partyListLeft.parties });

  const arrowsToAnimate = arrowList.map((arrow) => {
    return {
      baseArrow: new Arrow(
        rightContext,
        arrow.baseArrow.fromX,
        arrow.baseArrow.fromY,
        arrow.baseArrow.toX,
        arrow.baseArrow.toY,
        arrow.baseArrow.arrowWidth,
        arrow.baseArrow.color
      ),
      stepSize: arrow.stepSize,
      isPositivTrend: arrow.isPositivTrend,
      partyDirection: arrow.partyDirection,
      initialState: arrow.initialState,
    };
  });
  function animate() {
    requestAnimationFrame(animate);
    rightContext.clearRect(0, 0, 400, 400);
    arrowsToAnimate.forEach((arrow) => {
      arrow.baseArrow.update(
        arrow.stepSize,
        arrow.isPositivTrend,
        arrow.partyDirection,
        arrow.initialState
      );
    });
  }

  animate();
}

// Add canvas to map (The names are opposite for some reason I cant explain)
function addLeftCanvasToMap(map) {
  map.addSource("canvas-source", {
    type: "canvas",
    canvas: "leftCanvasID",
    coordinates: [
      [4.5, 70], //[lng, lat] Left top corner
      [18, 70], //[lng, lat] right top corner
      [18, 64.5], //[lng, lat] right bottom corner
      [4.5, 64.5], //[lng, lat] left bottom corner
    ],
    // Set to true if the canvas source is animated. If the canvas is static, animate should be set to false to improve performance.
    animate: true,
  });

  map.addLayer({
    id: "canvas-layer",
    type: "raster",
    source: "canvas-source",
  });
}

// Add canvas to map (The names are opposite for some reason I cant explain)
function addRightCanvasToMap(map) {
  map.addSource("canvas-source2", {
    type: "canvas",
    canvas: "rightCanvasID",
    coordinates: [
      [10.5, 70], //[lng, lat] Left top corner
      [24, 70], //[lng, lat] right top corner
      [24, 64.5], //[lng, lat] right bottom corner
      [10.5, 64.5], //[lng, lat] left bottom corner
    ],
    // Set to true if the canvas source is animated. If the canvas is static, animate should be set to false to improve performance.
    animate: true,
  });

  map.addLayer({
    id: "canvas-layer2",
    type: "raster",
    source: "canvas-source2",
  });
}

// Draws a border around nordland county
function addGeoJSONLineToMap(map) {
  map.addSource("route", {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: nordland.coordinates,
      },
    },
  });
  map.addLayer({
    id: "route",
    type: "line",
    source: "route",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#888",
      "line-width": 4,
    },
  });
}
