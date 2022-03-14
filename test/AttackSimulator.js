import { AttackSimulator } from "../src/services/simulator/AttackSimulator.js";
import { Buff } from "../src/models/Buff.js"
import { expectWithinPercentage } from "./testUtils.js";
const assert = require('assert');
const { it } = require('mocha');
const { expect } = require('chai');



const ATTACKS_COUNT = 50000;
const ERROR_MARGIN = 0.05;
let sim;

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
    it('Should simulate statistical average for attacks that do 2 damage on a 6 to wound', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 5, 
            rend: 0, 
            damage: '1',
        }, 7,{
            hit: [] ,
            wound: [ new Buff(Buff.TYPES.TRIGGER_DAMAGE, { trigger: [6], output: '2' }) ],          
        });
        expectWithinPercentage(sim.damage, (ATTACKS_COUNT/2/6*2)+(ATTACKS_COUNT/2/6), ERROR_MARGIN);     
    });  
    it('Should simulate statistical average for attacks that autowound on a 6 to hit', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 5, 
            wound: 4, 
            rend: 0, 
            damage: '1',
        }, 7,{
            hit: [ new Buff(Buff.TYPES.TRIGGER_WOUND, { trigger: [6] }) ] ,
            wound: [],          
        });
        expectWithinPercentage(sim.damage, ATTACKS_COUNT/6 + ATTACKS_COUNT/6*0.5, ERROR_MARGIN);     
    });  
    it('Should simulate statistical average for attacks that autowound on a 6 to hit but no wound triggers', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 0, 
            damage: '1',
        }, 7,{
            hit: [ new Buff(Buff.TYPES.TRIGGER_WOUND, { trigger: [4,5,6] }) ] ,
            wound: [    new Buff(Buff.TYPES.TRIGGER_DAMAGE, { trigger: [6], output: '2' }) ],          
        });
        expectWithinPercentage(sim.damage, ATTACKS_COUNT/2, ERROR_MARGIN);     
    }); 
    it('Should simulate statistical average for attacks that apply disease on a 6 to wound with 3+ virulence', function () {
        let total = 0;
        for(let i = 0; i < ATTACKS_COUNT; i++){
            sim = new AttackSimulator({
                number: 1,
                hit: 4, 
                wound: 4, 
                rend: 0, 
                damage: '1',
            }, 7,{
                hit: [] ,
                wound: [ new Buff(Buff.TYPES.TRIGGER_DISEASE, { trigger: [6], output: '1', "virulence": [3,4,5,6] }) ],          
            });
            total += sim.damage
        }
        expectWithinPercentage(total, ATTACKS_COUNT * 0.5 * 0.5 + ATTACKS_COUNT/2/6 * 2/3, ERROR_MARGIN);     
    }); 
    it('Should ensure no more than 7 disease points', function () {
        sim = new AttackSimulator({
            number: 10,
            hit: 1, 
            wound: 1, 
            rend: 0, 
            damage: '0',
        }, 7,{
            hit: [] ,
            wound: [ new Buff(Buff.TYPES.TRIGGER_DISEASE, { trigger: [1,2,3,4,5,6], output: '1', "virulence": [1,2,3,4,5,6] }) ],          
        });
        expectWithinPercentage(sim.damage, 7, 0);     
    });  
    it('Properly determine kills for 2 damage attacks on a 3 wound target', function () {
        sim = new AttackSimulator({
            number: 5,
            hit: 1, 
            wound: 1, 
            rend: 0, 
            damage: '2',
            options: { noSplash: true },
        }, 7,{
            hit: [] ,
            wound: [],          
        },0,1,
        {
            wounds: 3
        });
        expectWithinPercentage(sim.kills, 2.66, 0.01);     
    });  
    it('Properly determine kills for 2 damage attacks on a 3 wound target that does mortals on 6s to wound', function () {
        sim = new AttackSimulator({
            number: 5,
            hit: 1, 
            wound: 1, 
            rend: 0, 
            damage: '2',
            options: { noSplash: true },
        }, 7,{
            hit: [] ,
            wound: [ new Buff(Buff.TYPES.TRIGGER_MORTAL, { trigger: [1,2,3,4,5,6], output: '1', stop: false }) ],          
        },0,1,
        {
            wounds: 3
        });
        expectWithinPercentage(sim.kills, 2.66 + 5/3, 0.01);     
    });
    it('Properly determine kills when remaining wounds is set', function () {
        sim = new AttackSimulator({
            number: 5,
            hit: 1, 
            wound: 1, 
            rend: 0, 
            damage: '2',
            options: { noSplash: true },
        }, 7,{
            hit: [] ,
            wound: [],          
        },0,1,
        {
            wounds: 3
        }, 1);
        expectWithinPercentage(sim.kills, 3, 0.01);     
    }); 
    it('Properly determine kills for 2 damage attacks on a 3 wound target with variable stats', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 0, 
            damage: '2',
            options: { noSplash: true },
        }, 7,{
            hit: [] ,
            wound: [],          
        },0,1,
        {
            wounds: 3
        });
        expectWithinPercentage(sim.kills, ATTACKS_COUNT * 0.5 * 0.5 / 2 + ATTACKS_COUNT * 0.5 * 0.5 % 2, ERROR_MARGIN);     
    });
    it('Properly determine kills for attacks that only do mortals', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 0, 
            damage: '0',
            options: { noSplash: true },
        }, 7,{
            hit: [] ,
            wound: [ new Buff(Buff.TYPES.TRIGGER_MORTAL, { trigger: [5,6], output: '1', stop: false }) ],          
        },0,1,
        {
            wounds: 3
        });
        expectWithinPercentage(sim.kills, ATTACKS_COUNT * 0.5 * (1/3) / 3, ERROR_MARGIN);     
    });
    it('Properly determine kills for attacks that do mortals and variable stats', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 0, 
            damage: '2',
            options: { noSplash: true },
        }, 7,{
            hit: [] ,
            wound: [ new Buff(Buff.TYPES.TRIGGER_MORTAL, { trigger: [5,6], output: '1', stop: false }) ],          
        },0,1,
        {
            wounds: 3
        });
        expectWithinPercentage(sim.kills, ATTACKS_COUNT * 0.5 * 0.5 / 2 + ATTACKS_COUNT * 0.5 * 0.5 % 2 + ATTACKS_COUNT * 0.5 * (1/3) / 3, ERROR_MARGIN);     
    });
    it('Properly determine kills for attacks that do mortals and variable stats with no overkill possible', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 0, 
            damage: '2',
            options: { noSplash: true },
        }, 7,{
            hit: [] ,
            wound: [ new Buff(Buff.TYPES.TRIGGER_MORTAL, { trigger: [5,6], output: '1', stop: false }) ],          
        },0,1,
        {
            wounds: 4
        });
        expectWithinPercentage(sim.kills, ATTACKS_COUNT * 0.5 * 0.5 / 2 + ATTACKS_COUNT * 0.5 * (1/3) / 4, ERROR_MARGIN);     
    });
    it('Properly determine kills for attacks that overkill on every swing', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 0, 
            damage: '5',
            options: { noSplash: true },
        }, 7,{
            hit: [] ,
            wound: [],          
        },0,1,
        {
            wounds: 4
        });
        expectWithinPercentage(sim.kills, ATTACKS_COUNT * 0.5 * 0.5, ERROR_MARGIN);     
    });  
    it('Properly determine kills for 2 damage attacks on a 3 wound target that splashes', function () {
        sim = new AttackSimulator({
            number: 5,
            hit: 1, 
            wound: 1, 
            rend: 0, 
            damage: '2',
        }, 7,{
            hit: [] ,
            wound: [ new Buff(Buff.TYPES.TRIGGER_MORTAL, { trigger: [1,2,3,4,5,6], output: '1', stop: false }) ],          
        },0,1,
        {
            wounds: 3
        });
        expectWithinPercentage(sim.kills, 5, 0.01);     
    });
    it('Properly determine noSplash kills based on variable stats', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 0, 
            damage: '2',
            options: { noSplash: false },
        }, 7,{
            hit: [] ,
            wound: [],          
        },0,1,
        {
            wounds: 3
        });
        expectWithinPercentage(sim.kills, ATTACKS_COUNT * 0.5 * 0.5 * 2 / 3, ERROR_MARGIN);     
    }); 
    it('Properly determine noSplash kills based on variable stats with a save', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 0, 
            damage: '2',
            options: { noSplash: false },
        }, 4,{
            hit: [] ,
            wound: [],          
        },0,1,
        {
            wounds: 3
        });
        expectWithinPercentage(sim.kills, ATTACKS_COUNT * 0.5 * 0.5 * 0.5 * 2 / 3, ERROR_MARGIN);     
    }); 
    it('Properly determine noSplash kills based on variable stats with a save and rend', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 2, 
            damage: '2',
            options: { noSplash: false },
        }, 4,{
            hit: [] ,
            wound: [],          
        },0,1,
        {
            wounds: 3
        });
        expectWithinPercentage(sim.kills, ATTACKS_COUNT * 0.5 * 0.5 * (5/6) * 2 / 3, ERROR_MARGIN);     
    });
    it('Ensure kills matches damage ratioed in noSplash situations', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 2, 
            damage: '2',
            options: { noSplash: false },
        }, 4,{
            hit: [] ,
            wound: [],          
        },0,1,
        {
            wounds: 3
        });
        expectWithinPercentage(sim.kills, sim.damage / 3, ERROR_MARGIN);     
    });
    it('Ensure kills matches damage ratioed in noSplash situations with mortals', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 2, 
            damage: '2',
            options: { noSplash: false },
        }, 4,{
            hit: [ new Buff(Buff.TYPES.TRIGGER_MORTAL, { trigger: [5,6], output: '1', stop: false }) ] ,
            wound: [ new Buff(Buff.TYPES.TRIGGER_MORTAL, { trigger: [5,6], output: '1', stop: false }) ],          
        },0,1,
        {
            wounds: 3
        });
        expectWithinPercentage(sim.kills, sim.damage / 3, ERROR_MARGIN);     
    });
    it('Properly calculate based on an invulnerable save.', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 2, 
            damage: '2',
            options: { noSplash: false },
        }, 5,{
            hit: [] ,
            wound: [],          
        },0,1,
        {
            wounds: 3,
            invulnerable: 5,
        });
        expectWithinPercentage(sim.kills, ATTACKS_COUNT * 0.5 * 0.5 * (2/3) * 2 / 3, ERROR_MARGIN);     
    }); 
    it('Properly calculate based on an invulnerable save that is not strong enough to matter.', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 2, 
            damage: '2',
            options: { noSplash: false },
        }, 2,{
            hit: [] ,
            wound: [],          
        },0,1,
        {
            wounds: 3,
            invulnerable: 5,
        });
        expectWithinPercentage(sim.kills, ATTACKS_COUNT * 0.5 * 0.5 * 0.5 * 2 / 3, ERROR_MARGIN);     
    });
    it('Properly calculate kills based on a damage shrug.', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 4, 
            wound: 4, 
            rend: 2, 
            damage: '2',
            options: { noSplash: false },
        }, 5,{
            hit: [] ,
            wound: [],          
        },0,1,
        {
            wounds: 3,
            shrug: 5,
        });
        expectWithinPercentage(sim.kills, ATTACKS_COUNT * 0.5 * 0.5 * (2/3) * 2 / 3, ERROR_MARGIN);     
    });
    it('Properly calculate kills based on a damage shrug with mortals.', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 1, 
            wound: 4, 
            rend: 2, 
            damage: '0',
            options: { noSplash: false },
        }, 5,{
            hit: [] ,
            wound: [ new Buff(Buff.TYPES.TRIGGER_MORTAL, { trigger: [5,6], output: '1', stop: false }) ],          
        },0,1,
        {
            wounds: 3,
            shrug: 5,
        });
        expectWithinPercentage(sim.kills, ATTACKS_COUNT * (1/3) * (2/3) / 3, ERROR_MARGIN);     
    });
    it('Properly calculate damage based on a damage shrug with mortals.', function () {
        sim = new AttackSimulator({
            number: ATTACKS_COUNT,
            hit: 1, 
            wound: 4, 
            rend: 2, 
            damage: '2',
            options: { noSplash: false },
        }, 5,{
            hit: [] ,
            wound: [ new Buff(Buff.TYPES.TRIGGER_MORTAL, { trigger: [5,6], output: '1', stop: false }) ],          
        },0,1,
        {
            wounds: 3,
            shrug: 5,
        });
        expectWithinPercentage(sim.damage, ATTACKS_COUNT * 0.5 * (2/3) * 2 + ATTACKS_COUNT * (1/3) * (2/3), ERROR_MARGIN);     
    });  
});




