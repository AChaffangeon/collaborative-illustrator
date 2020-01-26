import { InfoPanel } from "./InfoPanel";
import { EventManager } from "../../Events/EventManager";
import { Shape } from "../Shapes/Shape";
import { FillChangedEvent } from "../../Events/FillChangedEvent";
import { ActionManager } from "../../Actions/ActionManager";
import * as d3 from "d3-selection";

/** A class to create a picker for the fill color. */
export class FillPicker {
    /** D3 selection of the picker. */
    holderSelection: d3.Selection<HTMLDivElement, any, any, any>;
    /** Value of the picker. */
    fill: string;

    constructor(infoPanel: InfoPanel) {
        this.holderSelection = infoPanel.holderSelection
            .append("div")
                .attr("id", "fill-picker")
                .classed("info-panel-element", true);
        this.fill = "none";
        this.setupUI();
        this.setupInteraction();
    }

    /**
     * Setups the UI of the picker.
     */
    private setupUI(): void {
        this.holderSelection
            .append("div")
                .classed("header", true)
                .text("Fill");

        let selectButton =
            this.holderSelection
                .append("select")
                    .attr("id", "color-picker-option-button");
        selectButton
            .append("option")
                .attr("value", "no-fill")
                .text("None / Transparent");
        selectButton
            .append("option")
                .attr("value", "fill")
                .text("Color");

        this.holderSelection
            .append("input")
                .attr("type", "color")
                .attr("value", this.fill)
                .style("display", "none");
    }

    /**
     * Setups the interaction of the picker.
     */
    private setupInteraction(): void {
        this.holderSelection
            .select("select")
                .on("change", () => {
                    let val = (document.getElementById("color-picker-option-button") as HTMLSelectElement).value;
                    if (val === "no-fill") {
                        this.holderSelection
                            .select("input")
                            .style("display", "none");

                        this.updateColor("none");
                    } else {
                        this.holderSelection
                            .select("input")
                            .style("display", "initial");

                        let v = (this.holderSelection.select("input").node() as HTMLInputElement).value;
                        this.updateColor(v);
                    }
                });

        this.holderSelection.select("input")
            .on("change", () => {
                let v = (this.holderSelection.select("input").node() as HTMLInputElement).value;
                this.updateColor(v);
            });
    }

    /**
     * Updates the fill property.
     * @param color New value for fill.
     */
    private updateColor(color: string): void {
        this.fill = color;

        let selectedShapes = Shape.getSelectedShapes();
        selectedShapes.forEach((shape) => {
            EventManager.emit(new FillChangedEvent(color, shape.id, ActionManager.userId, ActionManager.getTimeStamp()));
        });
    }

    /** Return the value of the picker. */
    getColor(): string {
        return this.fill;
    }

    /**
     * Sets the value of the value.
     * @param color New value.
     */
    setFill(color: string): void {
        this.fill = color;

        let selectButton =
            this.holderSelection
                .select("#color-picker-option-button")
                    .node() as HTMLSelectElement;
        let colorButton = this.holderSelection
            .select("input").node() as HTMLSelectElement;

        if (color === "none") {
            selectButton.value = "no-fill";
            d3.select(colorButton).style("display", "none");
        } else {
            selectButton.value = "fill";
            d3.select(colorButton)
                .style("display", "initial");
            colorButton.value = this.fill;
        }
    }
}
