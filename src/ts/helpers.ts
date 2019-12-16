/** Defines a point. */
export interface Point {
    x: number;
    y: number;
}

/** a class with various function to help. */
export class Helpers {
    /**
     * Return the coordinate of a point on screen in a svg
     * @param p The point on screen.
     * @param svg The svg.
     */
    static pageToSVG(p: Point, svgSelection: d3.Selection<SVGSVGElement, any, any, any>): Point {
        let svg = svgSelection.node();
        let pt = svg.createSVGPoint(), svgP;

        pt.x = p.x;
        pt.y = p.y;
        svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        return { x: svgP.x, y: svgP.y };
    }
}