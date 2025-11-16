export const gameResponses = {
    early: [
        'lol noob',
        'skill issue',
        'git good',
        'yikes',
        'oof',
        'try again',
        'git gud',
        'oof size: large',
        'rick is slightly dissapointed...'
    ],
    mid: [
        'not bad',
        'mid',
        'bruh',
        'nice try',
        'you aint getting there',
        'decent run',
        'keep going',
        'oof size: mid',
        'rick is proud of you'
    ],
    late: [
        'oof size: smol',
        'well done',
        'legenDAIRY',
        'almost there, almost where?',
        'so close, yet so far...',
        'amazing effort *clapping noises*',
        'fantastic, you got this far in a video game',
        'one more level! one more level!!',
        'never gonna give you up, never gonna let you down'
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
