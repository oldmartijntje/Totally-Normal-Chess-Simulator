const techTree = [
    { id: 0, cost: 0, name: "The Beginning", connections: [1, 4, 7, 15, 20], description: "This is the beginning of the tech tree.", image: "https://i.imgur.com/xgsFaaa.png" },
    { id: 1, cost: 250, name: "Tiny Bonus", connections: [2, 8], description: "Bonus credits on purchase is 5%.", image: "" },
    { id: 2, cost: 1000, name: "Small Bonus", connections: [3, 6], description: "Bonus credits on purchase is 10%.", image: "", x: 613, y: 200 },
    { id: 3, cost: 4500, name: "Medium Bonus", connections: [], description: "Bonus credits on purchase is 15%.", image: "" },
    { id: 4, cost: 4500, name: "Pawntection", connections: [12, 14, 16], description: "When someone attacks your pawn, have a 5% chance of escaping it by moving backwards.", image: "" },
    { id: 5, cost: 2500, name: "Orb", connections: [], description: "Have a 5% chance of spawning an Orb after your turn.", image: "" },
    { id: 6, cost: 3000, name: "Auto-box", connections: [11, 25], description: "Automatically refill your lootboxes when you reach 0 and have enough credits.", image: "" },
    { id: 7, cost: 2000, name: "Midas", connections: [], description: "When capturing a piece, 10% chance of getting 1 gold.", image: "" },
    { id: 8, cost: 1250, name: "Xtra Knowledge", connections: [9, 5], description: "Set bonus XP to 5%.", image: "" },
    { id: 9, cost: 1250, name: "More Skill", connections: [10, 21], description: "Set bonus XP to 10%.", image: "" },
    { id: 10, cost: 1250, name: "Some Expertise", connections: [25], description: "Set bonus XP to 15%.", image: "" },
    { id: 11, cost: 12500, name: "More Box", connections: [], description: "Double the chance of getting a lootbox spawn.", image: "" },
    { id: 12, cost: 4500, name: "Prick wall", connections: [13], description: "Merging 2 pawns has a chance of leaving behind a Brick.", image: "" },
    { id: 13, cost: 1500, name: "Spy", connections: [], description: "If a pawn gets 5 kills, It'll alert the government.", image: "" },
    { id: 14, cost: 1000, name: "Pawnvenge", connections: [], description: "If your pawn gets captured, it will give you 1 stone.", image: "" },
    { id: 15, cost: 10101, name: "Getting an upgrade", connections: [19], description: "You start the game with 1 Iron ingot.", image: "" },
    { id: 16, cost: 10000, name: "Procket Science", connections: [17], description: "Instead of 2 pawns merging into 1 Pawned, they merge into Procket.", image: "" },
    { id: 17, cost: 10000, name: "Procket Engineer", connections: [18], description: "Prockets ALWAYS move forwards.", hiddenDescription: true, image: "" },
    { id: 18, cost: 10000, name: "Big Boom", connections: [27], description: "Prockets have a chance to explode if they can't move forwards.", hiddenDescription: true, hiddenTitle: true, image: "" },
    { id: 19, cost: 6900, name: "Crafter", connections: [], description: "Unlock crafting.", hiddenDescription: true, hiddenTitle: true, image: "" },
    { id: 20, cost: 3000, name: "Xtra Twist", connections: [], description: "Start the game with 4 twists instead of 3.", image: "" },
    { id: 21, cost: 12500, name: "Capture Proficiency", connections: [22], description: "Get twice the XP for capturing pieces.", image: "" },
    { id: 22, cost: 12500, name: "Winner Competence", connections: [23], description: "Get triple the XP for winning.", image: "" },
    { id: 23, cost: 12500, name: "Merge Acquaintance", connections: [24], description: "Get triple the XP for merging pieces.", image: "" },
    { id: 24, cost: 12500, name: "Capture Understanding", connections: [], description: "Get twice the XP for capturing pieces. (combined with Capture Proficiency it's x4)", image: "" },
    { id: 25, cost: 1250, name: "XP Box", connections: [], description: "Opening a lootbox gives you XP.", image: "" },
    { id: 26, cost: 4000, name: "Box Hoarder", connections: [], description: "Have a 5% chance of not consuming a lootbox when spawning a lootbox.", image: "" },
    { id: 27, cost: 10000, name: "Bigger Boom", connections: [], description: "Prockets always explode if they can't move forwards.", hiddenDescription: true, hiddenTitle: true, image: "" },


];