export const gameResponses = {
    early: [
        'lol noob',
        'skill issue',
        'git good',
        'yikes',
        'oof',
        'try again',
        'git gud',
        'oof size: large'
    ],
    mid: [
        'not bad',
        'mid',
        'bruh',
        'nice try',
        'you aint getting there',
        'decent run',
        'keep going',
        'you cant do this next time'
    ],
    late: [
        'impressive',
        'well done',
        'legenDAIRY',
        'almost there',
        'so close, yet so far...',
        'amazing effort *clapping noises*',
        'fantastic, you got this far in a video game',
        'one more level! one more level!!'
    ]
};

export function getGameOverResponse(level) {
    let responseArray;
    if (level < 5) {
        responseArray = gameResponses.early;
    } else if (level < 16) {
        responseArray = gameResponses.mid;
    } else {
        responseArray = gameResponses.late;
    }
    
    return responseArray[Math.floor(Math.random() * responseArray.length)];
}
