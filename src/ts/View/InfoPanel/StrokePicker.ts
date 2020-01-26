import { InfoPanel } from "./InfoPanel";
import { EventManager } from "../../Events/EventManager";
import { Shape } from "../Shapes/Shape";
import { StrokeChangedEvent } from "../../Events/StrokeChangedEvent";
import { StrokeWidthChangedEvent } from "../../Events/StrokeWidthChangedEvent";
import { ActionManager } from "../../Actions/ActionManager";

/** A class to create a stroke picker */
export class StrokePicker {
    /** D3 selection of the picker. */
    holderSelection: d3.Selection<HTMLDivElement, any, any, any>;
    /** Color of the stroke. */
    stroke: string;
    /** Width of the stroke. */
    strokeWidth: number;

    constructor(infoPanel: InfoPanel) {
        this.holderSelection = infoPanel.holderSelection
            .append("div")
                .attr("id", "stroke-picker")
                .classed("info-panel-element", true);
        this.stroke = "#000000";
        this.strokeWidth = 2;
        this.setupUI();
        this.setupInteraction();
    }

    private setupUI(): void {
        this.holderSelection
            .append("div")
                .classed("header", true)
                .text("Stroke");

        this.holderSelection
            .append("input")
                .attr("type", "color")
                .attr("value", this.stroke);

        this.holderSelection
            .append("input")
                .attr("type", "range")
                .attr("min", 1)
                .attr("max", 100)
                .attr("value", this.strokeWidth);

        this.holderSelection
            .append("input")
                .attr("id", "stroke-width-text-input")
                .attr("type", "text")
                .attr("value", this.strokeWidth);

        this.holderSelection
            .append("label")
                .attr("for", "stroke-width-text-input")
                .text("px");
    }

    private setupInteraction(): void {
        this.holderSelection.select("input[type='color']")
            .on("change", () => {
                let v = (this.holderSelection.select("input[type='color']").node() as HTMLInputElement).value;
                this.updateStroke(v);
            });

        this.holderSelection.select("#stroke-width-text-input")
            .on("change", () => {
                let v = (this.holderSelection.select("#stroke-width-text-input").node() as HTMLInputElement).value;
                this.updateStrokeWidth(parseInt(v));
            });

        this.holderSelection.select("input[type='range']")
            .on("change", () => {
                let v = (this.holderSelection.select("input[type='range']").node() as HTMLInputElement).value;
                this.updateStrokeWidth(parseInt(v));
            });
    }

    /**
     * Updates stroke value.
     * @param color New value.
     */
    private updateStroke(color: string): void {
        this.stroke = color;

        let selectedShapes = Shape.getSelectedShapes();
        selectedShapes.forEach((shape) => {
            EventManager.emit(new StrokeChangedEvent(this.getStroke(), shape.id, ActionManager.userId, ActionManager.getTimeStamp()));
        });
    }

    /**
     * Updates stroke width value.
     * @param width New value.
     */
    updateStrokeWidth(width: number): void {
        this.strokeWidth = width;

        let input = document.getElementById("stroke-width-text-input") as HTMLInputElement;
        input.value = width.toString();

        let selectedShapes = Shape.getSelectedShapes();
        selectedShapes.forEach((shape) => {
            EventManager.emit(new StrokeWidthChangedEvent(width, shape.id, ActionManager.userId, ActionManager.getTimeStamp()));
        });
    }

    /**
     * Gets stroke color.
     * @returns stroke color.
     */
    getStroke(): string {
        return this.stroke;
    }

    /**
     * Gets stroke width.
     * @returns stroke width.
     */
    getStrokeWidth(): number {
        return this.strokeWidth;
    }

    /**
     * Sets stroke value.
     * @param color New value.
     */
    setStroke(color: string): void {
        this.stroke = color;

        (this.holderSelection
            .select("input[type='color']")
                .node() as HTMLInputElement)
                .value = color;
    }

    /**
     * Sets stroke width value.
     * @param width New value.
     */
    setStrokeWidth(width: number): void {
        this.strokeWidth = width;

        (this.holderSelection
            .select("#stroke-width-text-input")
            .node() as HTMLInputElement)
                .value = width.toString();

        (this.holderSelection
            .select("input[type='range']")
            .node() as HTMLInputElement)
                .value = width.toString();
    }
}
