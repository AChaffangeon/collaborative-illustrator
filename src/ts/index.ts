import { ToolBar } from "./View/ToolBar/ToolBar";
import { Canvas } from "./View/Canvas";
import { InfoPanel } from "./View/InfoPanel/InfoPanel";
import { PeerManager } from "./Peer2Peer/PeerManager";
import { ActionManager } from "./Actions/ActionManager";

new ActionManager(new Canvas(new ToolBar()));
new InfoPanel();
new PeerManager();