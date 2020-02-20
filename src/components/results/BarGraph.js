import { Utils } from "../../utils";

export class BarGraph extends Base {

	constructor(data, title, subTitle) {
		super();
		this.make("bar-graph");
		
		const graphTitle = new Header(4);
		graphTitle.text = title;
		this.addChild(graphTitle);

		const graphSubTitle = new Paragraph();
		graphSubTitle.text = subTitle;
		this.addChild(graphSubTitle);

		this.container = new Base();
		this.container.make("graph");
		this.addChild(this.container);

		this.update(data);
	}

	update(data) {
		this.container.text = "";
		let max = 0;
		data.forEach((item) => {
			max = item.value > max ? item.value : max;
		});
		if(max === 0) {
			max = 1;
		}

		data.forEach((item) => {
			const bar = new BarGraphBar(item,max);
			this.container.addChild(bar);
		});
	}

	shutDown() {
		this.clearListeners();
		if(this.obj.parentNode) {
			this.obj.parentNode.removeChild(this.obj);
		}
	}
	
}

class BarGraphBar extends Base {

	constructor(data,max) {
		super();
		this.make("bar");

		const rail = new Base();
		rail.make("rail");
		this.addChild(rail);

		const bar = new Base();
		bar.make("fill");
		rail.addChild(bar);
		bar.style.width = `calc(${data.value/( data.scale ? data.scale : max )*100}%)`
		bar.style.backgroundColor = `${data.color}`;

		const name = data.name && data.name.length > 20 ? `${data.name.substr(0,20)}` : data.name;

		const value = new Label();
		value.text = `<strong>${ name || Locale.gen("unit") }</strong> - ${data.format ? data.format(data.value) : data.value}`;
		this.addChild(value);

		if(data.inner) {
			const inner = new Base();
			inner.make("inner");
			bar.addChild(inner);
			inner.style.width = `${data.inner/data.value*100}%`;
		}
	}
}