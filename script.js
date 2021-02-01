//menu setup
const play = document.querySelector('#play');
const credits = document.querySelector('#credits');
const battleLog = document.querySelector('#battleLog');

play.addEventListener('click', () => {
  intro();
});

credits.addEventListener('click', () => {
  battleLog.innerHTML = 'Created by Billy Hepfinger, Kailee Pedersen, and Arthur Sato for CS Prep 39 using JavaScript, Bootstrap, and BootboxJS. Icons by Nikita Golubev on Flaticon (flaticon.com/authors/nikita-golubev).';
});

//flow of battle counters
let enemyTurnCounter = 0;
let heroHasFled = false;

const potion = {
  name: 'Potion of Healing',
  heal: () => {
    //add +5 to hero HP
    if (hero.health + 5 <= 10){
      hero.health += 5
    }
    //if current hp + 5 is higher than max, set to max currentHealth
    else {
      hero.health = 10;
    }
    //after use, delete potion
    hero.inventory.splice(0, 1);
    //flavor text
    bootbox.dialog({
      title: 'A refreshing draught of health!',
        message: `You drink deeply from the refreshing healing position. Your health is now ${hero.health}.`,
        size: 'small',
        container: '#battleLog',
        closeButton: false,
        buttons: {
          ok: {
            label: 'OK',
            callback: function(){
              enemyTurnStart();
          }
        },
      }
    });
  }
}

const scroll = {
  name: 'Scroll of Lightning',
  magicAttack: () => {
    //do 4 magic damage
    enemy.health -= 4;
    //after use, scroll disappears
    // if hero has two items, splice the second
    if (hero.inventory.length === 2){
      hero.inventory.splice(1, 2)
      bootbox.dialog({
      title: 'You call forth the heavens!',
        message: `The sky parts and a bolt of lightning strikes ${enemy.name} for 4 damage!`,
        size: 'small',
        container: '#battleLog',
        closeButton: false,
        buttons: {
          ok: {
            label: 'OK',
            callback: function(){
              enemyTurnStart();
          }
        },
      }
    });
    }
    else {
      // splice out the first which will always be scroll
      hero.inventory.splice(0,1)
      bootbox.dialog({
      title: 'You call forth the heavens!',
        message: `The sky parts and a bolt of lightning strikes ${enemy.name} for 4 damage!`,
        size: 'small',
        container: '#battleLog',
        closeButton: false,
        buttons: {
          ok: {
            label: 'OK',
            callback: function(){
              enemyTurnStart();
          }
        },
      }
    });
    }
  }
}

//hero object(s)
const hero = {
  name: '',
  // maxHealth: 10,
  // currentHealth: 10,
  health: 10,
  inventory: [potion, scroll],
  isDefending: false,
  isDodging: false,
  moves: {
    attack: () => {
      let damage;
      // if enemy.isDefending === true...
      if (enemy.isDefending === true){
        // return enemy.health -= 1;
          damage = 1;
      }
      // if enemy.isVulnerable === true... //-=3?
      else if (enemy.isVulnerable === true){
          damage = 3;
          }
      else {
        damage = 2;
      }
      enemy.health -= damage;
      bootbox.dialog({
      title: 'A crushing blow!',
      message: `You swing your trusty blade, ECMAscalibur, and strike ${enemy.name} for ${damage} damage!`,
      size: 'small',
      container: '#battleLog',
      closeButton: false,
      buttons: {
        ok: {
            label: 'OK',
            callback: function(){
              enemy.isDefending = false;
              enemy.isVulnerable = false;
              if (enemy.health <= 0) enemyDied();
              else if (heroHasFled) alert(`Game over.`);
              else enemyTurnStart();
            }
        },
      }
      });
    },
    defend: () => {
      // toggle hero.isDefending to true
      hero.isDefending = true;
      bootbox.dialog({
      title: 'Your father\'s shield!',
      message: 'You raise your shield to protect yourself. The metal gleams brightly in the harsh sunlight.',
      size: 'small',
      container: '#battleLog',
      closeButton: false,
      buttons: {
        ok: {
            label: 'OK',
            callback: function(){
              enemy.isDefending = false;
              enemy.isVulnerable = false;
              if (enemy.health <= 0) enemyDied();
              else if (heroHasFled) alert(`Game over.`);
              else enemyTurnStart();
            }
        },
      }
      });
    },
    dodge: () => {
      // determine whether dodge is successful
      // toggle hero.isDodging to true
      hero.isDodging = true;
      bootbox.dialog({
      title: 'Evasive maneuvers!',
      message: 'You attempt to evade the incoming attack...',
      size: 'small',
      container: '#battleLog',
      closeButton: false,
      buttons: {
        ok: {
            label: 'OK',
            callback: function(){
              enemy.isDefending = false;
              enemy.isVulnerable = false;
              if (enemy.health <= 0) enemyDied();
              else if (heroHasFled) alert(`Game over.`);
              else enemyTurnStart();
            }
        },
      }
      });
    },
    useItem: () => {
      //prompt user to select item in inventory
      if (hero.inventory.length === 0){
        bootbox.dialog({
        title: 'Your inventory is empty!',
        message: `Alas, alack, et cetera! Your rucksack is empty. Please choose another action.`,
        size: 'small',
        container: '#battleLog',
        closeButton: false,
        buttons: {
          ok: {
            label: 'OK',
            callback: function(){
              heroTurn();
              }
            },
          }
        })
      }
      // 2 items in inventory, potion or scroll
      if (hero.inventory.length === 2) {
        // choose item
        bootbox.dialog({
          title: 'You look inside your rucksack...',
            message: `Your inventory contains: ${potion.name} and ${scroll.name}. Which will you use?`,
            size: 'small',
            container: '#battleLog',
            closeButton: false,
            buttons: {
                potion: {
                    label: 'Use potion',
                    callback: function(){
                      potion.heal();
                    }
                },
                scroll: {
                    label: 'Use scroll',
                    callback: function(){
                      scroll.magicAttack();
                    }
                }
            }
        });
      } else if (hero.inventory.includes(potion)) {
          bootbox.dialog({
          title: 'You look inside your rucksack...',
            message: `Your inventory contains: ${potion.name}. Will you use it?`,
            size: 'small',
            container: '#battleLog',
            closeButton: false,
            buttons: {
                yes: {
                    label: 'Yes',
                    callback: function(){
                      potion.heal();
                    }
                },
                no: {
                    label: 'No',
                    callback: function(){
                      heroTurn();
                    }
                }
            }
        });
      } else if (hero.inventory.includes(scroll)) {
          bootbox.dialog({
          title: 'You look inside your rucksack...',
            message: `Your inventory contains: ${scroll.name}. Will you use it?`,
            size: 'small',
            container: '#battleLog',
            closeButton: false,
            buttons: {
                yes: {
                    label: 'Yes',
                    callback: function(){
                      scroll.magicAttack();
                    }
                },
                no: {
                    label: 'No',
                    callback: function(){
                      heroTurn();
                    }
                }
            }
        });
      }
    },
    run: () => {
      heroFled();  
    }
  }
}
//Enemy object(s)
const enemy = {
  name: 'Lord Ruby',
  // maxHealth: 12,
  // currentHealth:
  health: 12,
  isDefending: false,
  isVulnerable: false,
  moves: {
    attack: () => {
      // if hero.isDefending === true...
      let damage = 0;
      hero.health -= damage;
      hero.health <= 0 ? hero.health = 0 : hero.health;
      if (hero.isDefending){
        // return hero.health -= 1;
        damage = 1;
        bootbox.dialog({
        title: 'You guard against his attacks!',
        message: `You brace yourself, and Lord Ruby's mighty warhammer, HTMLnir, clangs ineffectually against your armor for 1 point of damage!`,
        size: 'small',
        container: '#battleLog',
        closeButton: false,
        buttons: {
          ok: {
            label: 'OK',
            callback: function(){
              hero.isDefending = false;
              hero.isDodging = false;
              if (hero.health <= 0) heroDied();
              else heroTurn();
            }
          },
        }
      });
      }
      else if (hero.isDodging) {
      // compare value for successful dodge in conditional
        let damage = 0;
        const successDodge = Math.random(1)*100
        if (successDodge < 50){
          damage = 2;
          hero.health -= damage;
          hero.health <= 0 ? hero.health = 0 : hero.health;
          bootbox.dialog({
          title: 'Dodge failed!',
          message: `You attempted to dodge his swing, but failed! Lord Ruby smashes his warhammer against your shoulder, denting it mightily and causing 2 points of damage. You stagger away and prepare yourself. `,
          size: 'small',
          container: '#battleLog',
          closeButton: false,
          buttons: {
            ok: {
              label: 'OK',
              callback: function(){
                hero.isDefending = false;
                hero.isDodging = false;
                if (hero.health <= 0) heroDied();
                else heroTurn();
            }
          },
        }
        });
        } else {
          let damage = 0;
          hero.health -= damage;
          hero.health <= 0 ? hero.health = 0 : hero.health;
          bootbox.dialog({
          title: 'Dodge success!',
          message: `You successfully evade Lord Ruby\'s attack! He howls in anger as you dodge his massive blow. `,
          size: 'small',
          container: '#battleLog',
          closeButton: false,
          buttons: {
            ok: {
              label: 'OK',
              callback: function(){
                hero.isDefending = false;
                hero.isDodging = false;
                if (hero.health <= 0) heroDied();
                else heroTurn();
            }
          },
        }
        });
        }
      }
      //regular attack, not defending/dodging
      else {
        let damage = 2
        hero.health -= damage;
        hero.health <= 0 ? hero.health = 0 : hero.health;
        bootbox.dialog({
          title: 'A definitive strike!',
          message: `Lord Ruby swings his warhammer, HTMLnir, and hits you for 2 points of damage. Your health is now ${hero.health}.`,
          size: 'small',
          container: '#battleLog',
          closeButton: false,
          buttons: {
            ok: {
              label: 'OK',
              callback: function(){
                hero.isDefending = false;
                hero.isDodging = false;
                if (hero.health <= 0) heroDied();
                else heroTurn();
            }
          },
        }
        });
      }
    },
    defend: () => {
      // toggle enemy.isDefending to true
      enemy.isDefending = true;
      bootbox.dialog({
        title: 'The enemy is on the defensive!',
        message: `You watch as Lord Ruby braces himself for your next attack...`,
        size: 'small',
        container: '#battleLog',
        closeButton: false,
        buttons: {
          ok: {
            label: 'OK',
            callback: function(){
              hero.isDefending = false;
              hero.isDodging = false;
              if (hero.health <= 0) heroDied();
              else heroTurn();
            }
          },
        }
      });
    },
    deathblow: () => {
      // always does 3 dmg
      // toggle enemy.isVulnerable to true
      let damage = 3;
      enemy.isVulnerable = true;
      hero.health -= damage;
      hero.health <= 0 ? hero.health = 0 : hero.health;
      bootbox.dialog({
        title: 'A shattering blow!',
        message: `Lord Ruby landed a devastating blow! However, such a mighty effort has rendered him temporarily vulnerable to your attacks. Your health is now ${hero.health}.`,
        size: 'small',
        container: '#battleLog',
        closeButton: false,
        buttons: {
          ok: {
            label: 'OK',
            callback: function(){
              hero.isDefending = false;
              hero.isDodging = false;
              if (hero.health <= 0) heroDied();
              else heroTurn();
            }
          },
        }
      });
    }
  }
}

function intro() {
  battleLog.innerHTML = '';
  enemyName.innerHTML = enemy.name;

  bootbox.prompt({ 
    size: "small",
    title: "What is your name?",
    container: '#battleLog',
    closeButton: false,
    callback: function(result){ 
        hero.name = result;
        heroName.innerHTML = result;
        introText();
    }
  });

let introText = () => bootbox.dialog({
    title: 'Our champion approaches!',
    message: `Hello good knight! Please help us, Ser ${hero.name}! The kingdom has been besieged by the evil Lord Ruby!`,
    size: 'small',
    container: '#battleLog',
    closeButton: false,
    buttons: {
        ok: {
            label: 'OK',
            callback: function(){
              heroTurn();
            }
        },
    }
  });
}

// character creation (also a function)
  // prompt player to enter name
  // save name to hero object
  // (stretch goals: choose class, choose inventory)

//turn-based combat functionality (wait n seconds, then call)
function heroTurn() {
  // prompt player to choose their action (enter number)
  bootbox.dialog({
    title: 'Hero\'s turn!',
    message: `Ser ${hero.name}, a scourge has come to our kingdom at last! What will you do?`,
    size: 'small',
    container: '#battleLog',
    closeButton: false,
    buttons: {
        attack: {
            label: 'Attack',
            callback: function(){
              hero.moves.attack();
            }
        },
        defend: {
            label: 'Defend',
            callback: function(){
              hero.moves.defend();
            }
        },
        dodge: {
            label: 'Dodge',
            callback: function(){
              hero.moves.dodge();
            }
        },
        useItem: {
            label: 'Use Item',
            callback: function(){
              hero.moves.useItem();
            }
        },
        run: {
            label: 'Run',
            callback: function(){
              hero.moves.run();
            }
        },
    }
  });
}
  
function enemyTurnStart() {
    enemyTurnCounter++;
    bootbox.dialog({
    title: 'Your enemy comes near!',
    message: `${enemy.name} looks at you with burning hatred in his eyes.`,
    size: 'small',
    container: '#battleLog',
    closeButton: false,
    buttons: {
      ok: {
        label: 'OK',
          callback: function() {
            enemyMoveDecision();
          }
        },
      }
    });
}

function enemyMoveDecision() { 
  if (enemyTurnCounter % 5 === 0) enemy.moves.deathblow();
  else if (enemyTurnCounter % 3 === 0) enemy.moves.defend();
  else enemy.moves.attack();
}

//enemy dies ending
function enemyDied() {
  document.getElementById('playerImage').src = 'https://i.imgur.com/RnwW3Th.png'
  bootbox.dialog({
    title: 'You are victorious!',
    message: `Congratulations! Your foe is vanquished! You are victorious and have saved the kingdom.`,
    size: 'small',
    container: '#battleLog',
    closeButton: false,
    buttons: {
      ok: {
        label: 'OK',
        callback: function(){
          restartGame();
        }
      }
    }
  })
}

//hero dies ending
function heroDied() {
  document.getElementById('playerImage').src = 'https://i.imgur.com/RnwW3Th.png'
  bootbox.dialog({
    title: 'You have been defeated!',
    message: `On this sorrowful day, you fell valiantly in battle against ${enemy.name}. The kingdom is in ruins.`,
    size: 'small',
    container: '#battleLog',
    closeButton: false,
    buttons: {
      ok: {
        label: 'OK',
        callback: function(){
          restartGame();
        }
      }
    }
  })
}

//hero flees ending
function heroFled() {
  bootbox.dialog({
    title: 'You flee the battle!',
    message: `You turn and flee in fear. You live to fight another day, but now everyone knows you're a coward.`,
    size: 'small',
    container: '#battleLog',
    closeButton: false,
    buttons: {
      ok: {
        label: 'OK',
        callback: function(){
          heroHasFled = true;
          restartGame();
        }
      },
    }
  });
}

//restart game function
function restartGame() {
  //reset all game values
  enemyTurnCounter = 0;
  hero.health = 10;
  hero.inventory = [potion, scroll];
  enemy.health = 12;
  heroHasFled = false; 
  document.getElementById('playerImage').src = 'https://i.imgur.com/vtoq5kz.png';
  bootbox.dialog({
    title: 'Restart game?',
    message: `Thanks for playing! Play again?`,
    size: 'small',
    container: '#battleLog',
    closeButton: false,
    buttons: {
      confirm: {
        label: 'Confirm',
        callback: function(){
          intro()
        }
      },
      cancel: {
        label: 'Exit',
        callback: function(){
          return;
        }
      },
    }
  });
}