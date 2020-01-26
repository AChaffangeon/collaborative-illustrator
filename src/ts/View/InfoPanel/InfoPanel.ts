import * as d3 from "d3-selection";
import { StrokePicker } from "./StrokePicker";
import { FillPicker } from "./FillPicker";
import { PeerDisplay } from "./PeerDisplay";

/** A class to create an info panel. */
export class InfoPanel {
    /** D3 selection of div #info-panel. */
    holderSelection: d3.Selection<HTMLDivElement, any, any, any>;
    /** Stroke picker of the info panel. */
    strokePicker: StrokePicker;
    /** Fill picker of the info panel. */
    fillPicker: FillPicker;
    /** List of peers connected. */
    peerList: PeerDisplay;

    constructor() {
        this.holderSelection = d3.select("#info-panel");
        this.strokePicker = new StrokePicker(this);
        this.fillPicker = new FillPicker(this);
        this.peerList = new PeerDisplay(this);
    }

    /**
     * Sets fill value of the fill picker.
     * @param color New value.
     */
    setFill(color: string): void {
        this.fillPicker.setFill(color);
    }

    /**
     * Sets stroke value of the stroke picker.
     * @param color New value.
     */
    setStroke(color: string): void {
        this.strokePicker.setStroke(color);
    }

    /**
     * Sets stroke width value of the stroke picker.
     * @param width New value.
     */
    setStrokeWidth(width: number): void {
        this.strokePicker.setStrokeWidth(width);
    }
}
