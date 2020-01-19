import { InfoPanel } from "./InfoPanel";
import { EventManager } from "../../Events/EventManager";
import { Shape } from "../Shapes/Shape";
import { FillChangedEvent } from "../../Events/FillChangedEvent";
import { ActionManager } from "../../Actions/ActionManager";

export class FillPicker {
    holderSelection: d3.Selection<HTMLDivElement, any, any, any>;
    fill: string;

    constructor(infoPanel: InfoPanel) {
        this.holderSelection = infoPanel.holderSelection
            .append("div")
                .attr("id", "fill-picker")
                .classed("picker", true);
        this.fill = "none";
        this.setupUI();
        this.setupInteraction();
    }

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

    updateColor(color: string): void {
        this.fill = color;

        let selectedShapes = Shape.getSelectedShapes();
        selectedShapes.forEach((shape) => {
            EventManager.emit(new FillChangedEvent(color, shape.id, ActionManager.userId, ActionManager.timeStamp));
        });
    }

    getColor(): string {
        return this.fill;
    }
}