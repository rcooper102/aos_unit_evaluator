const { expect } = require('chai');

export function expectWithinPercentage(value, target, percent) {
	 expect(value).to.be.within(Math.round(target*(1 - percent)*100)/100, Math.round(target*(1 + percent)*100)/100);
}