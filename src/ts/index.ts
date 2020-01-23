import { ToolBar } from "./View/ToolBar/ToolBar";
import { Canvas } from "./View/Canvas";
import { InfoPanel } from "./View/InfoPanel/InfoPanel";
import { ActionManager } from "./Actions/ActionManager";
import { LoginMenu } from "./LoginMenu";
import { PeerManager } from "./Peer2Peer/PeerManager";

let infoPanel = new InfoPanel();
new LoginMenu(new PeerManager(new ActionManager(new Canvas(new ToolBar(), infoPanel)),infoPanel.peerList ));
