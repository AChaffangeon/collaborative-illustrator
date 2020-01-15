import { ToolBar } from "./View/ToolBar/ToolBar";
import { Canvas } from "./View/Canvas";
import { InfoPanel } from "./View/InfoPanel/InfoPanel";
import { ActionManager } from "./Actions/ActionManager";
import { LoginMenu } from "./LoginMenu";

new LoginMenu();
new ActionManager(new Canvas(new ToolBar()));
new InfoPanel();

