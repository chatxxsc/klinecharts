export function checkOnText(coordinate, attrs, styles) {
    var texts = [].concat(attrs);
    for (var i = 0; i < texts.length; i++) {
      var { x, y, width, height } = getTextRect(texts[i], styles);
      if (coordinate.x >= x && coordinate.x <= x + width &&
          coordinate.y >= y && coordinate.y <= y + height) {
        return true;
      }
    }
    return false;
  }
  
  export function drawwithText(ctx, attrs, styles) {
    var T = ctx;
    var a = { x: attrs.x, y: attrs.y };
    var Z = attrs.text.side;
    
    T.font = "12px Roboto";
    T.fillStyle = attrs.text.color;
    T.strokeStyle = attrs.text.color;
    
    var o = Z;
    var c = T.measureText(o).width;
    var n = a.x;
    var r = a.y - 6;
  
    T.setLineDash([3, 3]);
    T.beginPath();
    T.moveTo(n, r);
    T.lineTo(n, r - 50);
    T.closePath();
    T.stroke();
    r -= 50;
    T.beginPath();
    T.moveTo(n, r);
    T.lineTo(n - 4, r - 5);
    T.lineTo(n + 4, r - 5);
    T.closePath();
    T.fill();
    
    var i = n - c / 2 - 6;
    var l = r - 5 - 28;
    var s = c + 12;
    var m = 28;
    var d = 5;
    
    T.beginPath();
    T.moveTo(i + d, l);
    T.arcTo(i + s, l, i + s, l + m, d);
    T.arcTo(i + s, l + m, i, l + m, d);
    T.arcTo(i, l + m, i, l, d);
    T.arcTo(i, l, i + s, l, d);
    T.closePath();
    T.fill();
    T.fillStyle = "#fff";
    T.textBaseline = "middle";
    T.textAlign = "center";
    T.fillText(o, n, r - 5 - 14);
  }
  
  export const text = {
    name: 'xxscTextline',
    checkEventOn: checkOnText,
    draw: function (ctx, attrs, styles) {
      drawwithText(ctx, attrs, styles);
    }
  };
  

  export const priceLine = {
    name: 'texttag',
    totalStep: 2,
    needDefaultPointFigure: true,
    needDefaultXAxisFigure: true,
    needDefaultYAxisFigure: true,
    createPointFigures: function (_a) {
        var coordinates = _a.coordinates,overlay = _a.overlay;   
        var figures = [];
        for (var i = 0; i < overlay.points.length; i++) {
            var value = overlay.extendData[i]
  
            figures.push({
                type: 'xxscTextline',
                ignoreEvent: true,
                attrs: {
                    x: coordinates[i].x,
                    y: coordinates[i].y,
                    text: value
                },
                styles: {
                  color: "#00d0aa"
                }
  
            });
        }
  
        return figures;
    }
  };