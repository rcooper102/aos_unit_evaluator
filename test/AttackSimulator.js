import { AttackSimulator } from "../src/services/simulator/AttackSimulator.js";
import { Buff } from "../src/models/Buff.js"
const assert = require('assert');
const { it } = require('mocha');
const { expect } = require('chai');



const ATTACKS_COUNT = 50000;
const ERROR_MARGIN = 0.05;
let sim;

let expectWithinPercentage = function(value, target, percent) {
	 expect(value).to.be.within(Math.round(target*(1 - percent)), Math.round(target*(1 + percent)));
}

describe('AttackSimulator', function () {	
 	it('Should simulate statistical average for 4+/4+ attacks with no rend', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: 1,
        }, 7);
        expectWithinPercentage(sim.damage, ATTACKS_COUNT*0.5*0.5, ERROR_MARGIN);    
    });
    it('Should simulate statistical average for 2+/5+ attacks with no rend', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 2, 
        	wound: 5, 
        	rend: 0, 
        	damage: 1,
        }, 7);
        expectWithinPercentage(sim.damage, ATTACKS_COUNT*5/6/3, ERROR_MARGIN);    
    });
    it('Should simulate statistical average for attacks against a save', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: 1,
        }, 4);
        expectWithinPercentage(sim.damage, ATTACKS_COUNT*0.5*0.5*0.5, ERROR_MARGIN);    
    });
    it('Should simulate statistical average for attacks with rend against a save', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 2, 
        	damage: 1,
        }, 4);
        expectWithinPercentage(sim.damage, ATTACKS_COUNT*0.5*0.5*5/6, ERROR_MARGIN);    
    }); 
    it('Should simulate statistical average for attacks with multiple damage', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: 2,
        }, 7);
        expectWithinPercentage(sim.damage, ATTACKS_COUNT*0.5*0.5*2, ERROR_MARGIN);    
    });    
    it('Should simulate statistical average for attacks with variable damage', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: 'd3',
        }, 7);
        expectWithinPercentage(sim.damage, ATTACKS_COUNT*0.5*0.5*2, ERROR_MARGIN);    
    });   
    it('Should simulate statistical average for attacks with variable damage and a save', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: 'd3',
        }, 5);
        expectWithinPercentage(sim.damage, ATTACKS_COUNT*0.5*0.5*2/3*2, ERROR_MARGIN);    
    });
    it('Should simulate statistical average for attacks with rend and variable damage and a save', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 2, 
        	damage: 'd6',
        }, 2);
        expectWithinPercentage(sim.damage, ATTACKS_COUNT*0.5*0.5*0.5*3.5, ERROR_MARGIN);    
    });
    it('Should simulate statistical average for attacks with a variable amount of attacks', function () {
        sim = new AttackSimulator({
        	number: `${ATTACKS_COUNT}d3`,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: '1',
        }, 7);
        expectWithinPercentage(sim.damage, ATTACKS_COUNT*2*0.5*0.5, ERROR_MARGIN);    
    });  
    it('Should simulate statistical average for attacks that re-roll 1s to hit', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: '1',
        }, 7,{
        	hit: [ new Buff(Buff.TYPES.REROLL, [1]) ],
        	wound: []        	
        });
        expectWithinPercentage(sim.damage, (ATTACKS_COUNT + ATTACKS_COUNT / 6) * 0.5 * 0.5, ERROR_MARGIN);    
    });
    it('Should simulate statistical average for attacks that re-roll 1,2,3s to wound', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: '1',
        }, 7,{
        	hit: [],
        	wound: [ new Buff(Buff.TYPES.REROLL, [1,2,3]) ]        	
        });
        expectWithinPercentage(sim.damage, (ATTACKS_COUNT * 0.5) * 0.75, ERROR_MARGIN);    
    }); 
    it('Should simulate statistical average for attacks that re-roll hits and wounds', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: '1',
        }, 7,{
        	hit: [ new Buff(Buff.TYPES.REROLL, [1,2,3]) ],
        	wound: [ new Buff(Buff.TYPES.REROLL, [1,2,3]) ]        	
        });
        expectWithinPercentage(sim.damage, (ATTACKS_COUNT * 0.75) * 0.75, ERROR_MARGIN);    
    }); 
    it('Should simulate statistical average for attacks that stop and do mortal wounds on 6s to hit', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: '1',
        }, 7,{
        	hit: [ new Buff(Buff.TYPES.TRIGGER_MORTAL, { trigger: [6], output: 1, stop: true }) ] ,
        	wound: [],       	
        });
        expectWithinPercentage(sim.damage, ATTACKS_COUNT / 3 * 0.5 + ATTACKS_COUNT / 6, ERROR_MARGIN); 
        expectWithinPercentage(sim.mortalWounds, ATTACKS_COUNT / 6, ERROR_MARGIN);    
    });
    it('Should simulate statistical average for attacks that re-roll 1s to hit and do mortal wounds on 6s to hit', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 0, 
            damage: '1',
        }, 7,{
            hit: [ new Buff(Buff.TYPES.REROLL, [1]), new Buff(Buff.TYPES.TRIGGER_MORTAL, { trigger: [6], output: 1, stop: false }) ],
            wound: []           
        });
        expectWithinPercentage(sim.damage, (ATTACKS_COUNT + ATTACKS_COUNT / 6) * 0.5 * 0.5 + (ATTACKS_COUNT + ATTACKS_COUNT / 6) / 6, ERROR_MARGIN);
        expectWithinPercentage(sim.mortalWounds, (ATTACKS_COUNT + ATTACKS_COUNT / 6) / 6, ERROR_MARGIN);     
    });
    it('Should simulate statistical average for attacks that re-roll 1s to hit and do mortal wounds on 6s to hit that stop the attack sequence', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 0, 
            damage: '1',
        }, 7,{
            hit: [ new Buff(Buff.TYPES.REROLL, [1]), new Buff(Buff.TYPES.TRIGGER_MORTAL, { trigger: [6], output: 1, stop: true }) ],
            wound: []           
        });
        expectWithinPercentage(sim.damage, (ATTACKS_COUNT + ATTACKS_COUNT / 6) / 3 * 0.5 + (ATTACKS_COUNT + ATTACKS_COUNT / 6) / 6, ERROR_MARGIN);
        expectWithinPercentage(sim.mortalWounds, (ATTACKS_COUNT + ATTACKS_COUNT / 6) / 6, ERROR_MARGIN);     
    }); 
    it('Should simulate statistical average for attacks that do not stop and do mortal wounds on 6s to hit', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: '1',
        }, 7,{
        	hit: [ new Buff(Buff.TYPES.TRIGGER_MORTAL, { trigger: [6], output: 1, stop: false }) ] ,
        	wound: [],       	
        });
        expectWithinPercentage(sim.damage, ATTACKS_COUNT * 0.5 * 0.5 + ATTACKS_COUNT / 6, ERROR_MARGIN); 
        expectWithinPercentage(sim.mortalWounds, ATTACKS_COUNT / 6, ERROR_MARGIN);    
    });
    it('Should simulate statistical average for attacks that do not stop and do variable mortal wounds on 6s to hit', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: '1',
        }, 7,{
        	hit: [ new Buff(Buff.TYPES.TRIGGER_MORTAL, { trigger: [6], output: 'd3', stop: false }) ] ,
        	wound: [],       	
        });
        expectWithinPercentage(sim.damage, ATTACKS_COUNT * 0.5 * 0.5 + ATTACKS_COUNT / 6 * 2, ERROR_MARGIN); 
        expectWithinPercentage(sim.mortalWounds, ATTACKS_COUNT / 6 * 2, ERROR_MARGIN);    
    }); 
    it('Should simulate statistical average for attacks that generate additional attacks on a 6 that do not autohit', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: '1',
        }, 7,{
        	hit: [ new Buff(Buff.TYPES.TRIGGER_ATTACKS, { trigger: [6], output: 1, stop: false }) ] ,
        	wound: [],       	
        });
        expectWithinPercentage(sim.damage, (ATTACKS_COUNT + ATTACKS_COUNT/6) * 0.5 * 0.5, ERROR_MARGIN);     
    }); 
    it('Should simulate statistical average for attacks that generate additional attacks on a 6 that do autohit', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: '1',
        }, 7,{
        	hit: [ new Buff(Buff.TYPES.TRIGGER_ATTACKS, { trigger: [6], output: 1, stop: false, autoHit: true }) ] ,
        	wound: [],       	
        });
        expectWithinPercentage(sim.damage, (ATTACKS_COUNT * 0.5 + ATTACKS_COUNT/6) * 0.5, ERROR_MARGIN);     
    });
    it('Should simulate statistical average for attacks that generate 2 hits on a 6', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: '1',
        }, 7,{
        	hit: [ new Buff(Buff.TYPES.TRIGGER_ATTACKS, { trigger: [6], output: 2, stop: true, autoHit: true }) ] ,
        	wound: [],       	
        });
        expectWithinPercentage(sim.damage, (ATTACKS_COUNT/3 + ATTACKS_COUNT/6*2) * 0.5, ERROR_MARGIN);     
    }); 
    it('Should simulate statistical average for attacks that generate d6 hits on a 5,6', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 0, 
            damage: '1',
        }, 7,{
            hit: [ new Buff(Buff.TYPES.TRIGGER_ATTACKS, { trigger: [5,6], output: 'd6', stop: true, autoHit: true }) ] ,
            wound: [],          
        });
        expectWithinPercentage(sim.damage, (ATTACKS_COUNT/6 + ATTACKS_COUNT/3*3.5) * 0.5, ERROR_MARGIN);     
    }); 
    it('Should simulate statistical average for attacks that do 1 rend on a 6', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: '1',
        }, 4,{
        	hit: [ new Buff(Buff.TYPES.TRIGGER_REND, { trigger: [6], output: 1 }) ] ,
        	wound: [],       	
        });
        expectWithinPercentage(sim.damage, (ATTACKS_COUNT/3 * 0.5 * 0.5) + (ATTACKS_COUNT/6 * 0.5 * 2/3 ), ERROR_MARGIN);     
    }); 
    it('Should simulate statistical average for attacks that do 3 rend on a 6', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 1, 
            damage: '1',
        }, 4,{
            hit: [ new Buff(Buff.TYPES.TRIGGER_REND, { trigger: [6], output: 3 }) ] ,
            wound: [],          
        });
        expectWithinPercentage(sim.damage, (ATTACKS_COUNT/3 * 0.5 * 2/3) + (ATTACKS_COUNT/6 * 0.5 ), ERROR_MARGIN);     
    }); 
    it('Should simulate statistical average for attacks that do 2 damage on a 6', function () {
        sim = new AttackSimulator({
        	number: ATTACKS_COUNT,
        	hit: 4, 
        	wound: 4, 
        	rend: 0, 
        	damage: '1',
        }, 7,{
        	hit: [ new Buff(Buff.TYPES.TRIGGER_DAMAGE, { trigger: [6], output: 2 }) ] ,
        	wound: [],       	
        });
        expectWithinPercentage(sim.damage, (ATTACKS_COUNT/3 * 0.5) + (ATTACKS_COUNT/6 * 0.5 * 2 ), ERROR_MARGIN);     
    }); 
    it('Should simulate statistical average for attacks that do d3 mortals on a 6 to wound and reroll hits', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 0, 
            damage: '1',
        }, 7,{
            hit: [ new Buff(Buff.TYPES.REROLL, [1,2,3]) ] ,
            wound: [ new Buff(Buff.TYPES.TRIGGER_MORTAL, { trigger: [6], output: 'd3', stop: false }) ],          
        });
        expectWithinPercentage(sim.damage, (ATTACKS_COUNT * 0.75) / 2 + (ATTACKS_COUNT * 0.75) / 6 * 2, ERROR_MARGIN);     
        expectWithinPercentage(sim.mortalWounds, (ATTACKS_COUNT * 0.75) / 6 * 2, ERROR_MARGIN);    
    });  
    it('Should simulate statistical average for attacks that do d3 damage on a 5,6', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 0, 
            damage: '1',
        }, 7,{
            hit: [ new Buff(Buff.TYPES.TRIGGER_DAMAGE, { trigger: [5,6], output: 'd3' }) ] ,
            wound: [],          
        });
        expectWithinPercentage(sim.damage, (ATTACKS_COUNT/6 * 0.5) + (ATTACKS_COUNT/3 * 0.5 * 2 ), ERROR_MARGIN);     
    });      
});





