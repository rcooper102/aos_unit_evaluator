import { Utils } from "../../utils";
import "./ModalWindow.scss";

export class ModalWindow extends Base {

	constructor() {
		super();
		this.make("modal-window");
		Body.addChild(this);

		this.window = new Base();
		this.window.make('window');
		this.addChild(this.window);

		this.windowHeader = new Base();
		this.windowHeader.make("window-header");
		this.window.addChild(this.windowHeader)

		this.close = new Base();
		this.close.make("close");
		this.close.text = "X";
		this.windowHeader.addChild(this.close);
		this.close.addListener(MouseEvent.CLICK, this.onClose, this);

		this.windowTitle = new Header(3);
		this.windowTitle.text = "Test";
		this.windowHeader.addChild(this.windowTitle);

		this.container = new Base();
		this.container.make('container');
		this.window.addChild(this.container);
	}

	get title() {
		return this.windowTitle.text;
	}

	set title(target) {
		this.windowTitle.text = target;
	}

	onClose() {
		this.shutDown();
	}

	shutDown() {
		if(this.obj.parentNode) {
			this.obj.parentNode.removeChild(this.obj);
		}
	}

}