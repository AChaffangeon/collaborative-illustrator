import { InfoPanel } from "./InfoPanel";
import { EventManager } from "../../Events/EventManager";
import { ColorChangedEvent } from "../../Events/ColorChangedEvent";

export class ColorPicker {
    holderSelection: d3.Selection<HTMLDivElement, any, any, any>;

    constructor(infoPanel: InfoPanel) {
        this.holderSelection = infoPanel.holderSelection.append("div").attr("id", "color-picker");
        this.setupUI();
        this.setupInteraction();
    }

    private setupUI(): void {
        this.holderSelection.append("input")
            .attr("type", "text")
            .attr("value", "000000");
    }

    private setupInteraction(): void {
        this.holderSelection.select("input")
            .on("change", () => {
                EventManager.emit(new ColorChangedEvent(this.getColor()));
            });
    }

    getColor(): string {
        let input = this.holderSelection.select("input").node() as HTMLInputElement;
        let color = input.value;
        if (color[0] !== "#") {
            color = "#" + color;
        }
        return color;
    }
}