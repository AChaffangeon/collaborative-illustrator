"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Helpers {
    static pageToSVG(p, svgSelection) {
        let svg = svgSelection.node();
        let pt = svg.createSVGPoint(), svgP;
        pt.x = p.x;
        pt.y = p.y;
        svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        return { x: svgP.x, y: svgP.y };
    }
    static pointsToDAttr(pts) {
        let d = `M${pts[0].x}, ${pts[0].y}`;
        for (let i = 1; i < pts.length; i++) {
            d += ` L${pts[i].x}, ${pts[i].y}`;
        }
        return d;
    }
}
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map