import Editor from "./Editor";
import RenderView from "./RenderView";

const renderView = new RenderView();

new Editor(renderView.port);
